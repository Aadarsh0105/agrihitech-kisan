const User = require("./auth.model");
const OTP = require("./otp.model");
const bcrypt = require("bcrypt");
const cloudinary = require("../../config/cloudinary");
const client = require("../../config/twilio");
const streamifier = require("streamifier");
const fs = require("fs");
const axios = require("axios");
const Product = require("../product/product.model");
const Brand = require("../brand/brand.model");

// 🔢 Generate 4 digit OTP
const generateOTP = () => {
  // return Math.floor(1000 + Math.random() * 9000).toString();
  return "1234"; // for testing only
};



  // 📤 SEND SMS USING TWILIO
  // await client.messages.create({
  //   body: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: `+91${mobile}`, // must be +91XXXXXXXXXX
  // });


// 📲 Send OTP
// 📲 Send OTP
exports.sendOtp = async (mobile, role = "B2C") => {
  const user = await User.findOne({ mobile });

  // New user allowed only for B2C
  if (!user && role !== "B2C") {
    throw new Error(`${role} user must register first`);
  }

  // If logging in as B2B, allow both B2B and ADMIN
  if (
    user &&
    role === "B2B" &&
    user.role !== "B2B" &&
    user.role !== "ADMIN"
  ) {
    throw new Error(
      `This mobile number is registered as ${user.role}. Please login with correct role.`
    );
  }

  // Normal mismatch check for other roles
  if (
    user &&
    role !== "B2B" &&
    user.role !== role
  ) {
    throw new Error(
      `This mobile number is registered as ${user.role}. Please login with correct role.`
    );
  }

  await OTP.deleteMany({ mobile });

  const otp = generateOTP();

  // 📤 SEND SMS USING TWILIO
  // await client.messages.create({
  //   body: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: `+91${mobile}`, // must be +91XXXXXXXXXX
  // });


  await OTP.create({
    mobile,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  // console.log("OTP:", otp);

  return {
    message: "OTP sent successfully",
    otp,
  };
};

// ✅ Verify OTP
exports.verifyOtp = async (mobile, otp, role) => {
  const record = await OTP.findOne({ mobile, otp });

  if (!record) throw new Error("Invalid OTP");
  if (record.expiresAt < new Date()) throw new Error("OTP Expired");

  let user = await User.findOne({ mobile });

  // New user allowed only for B2C
  if (!user) {
    if (role === "B2C") {
      user = await User.create({
        mobile,
        role: "B2C",
        isVerified: true,
      });
    } else {
      throw new Error(`${role} user must register first`);
    }
  }

  // Special case: B2B login allows both B2B and ADMIN
  if (
    role === "B2B" &&
    user.role !== "B2B" &&
    user.role !== "ADMIN"
  ) {
    throw new Error(`This number belongs to ${user.role}`);
  }

  // Normal role mismatch check
  if (
    role !== "B2B" &&
    user.role !== role
  ) {
    throw new Error(`This number belongs to ${user.role}`);
  }

  user.isVerified = true;
  await user.save();

  const token = user.generateAuthToken();

  await OTP.deleteOne({ _id: record._id });

  return { token, user };
};


// User Register
exports.registerB2B = async (data) => {
  const {
    mobile,
    firmName,
    proprietorName,
    state,
    district,
    village,
    pincode,
    categories: submittedCategories,
    dealerBrands
  } = data;

  const categories = Array.isArray(submittedCategories)
    ? submittedCategories
    : submittedCategories ? [submittedCategories] : [];

  if (!categories.length || categories.some(category => typeof category !== "string" || !category.trim())) {
    throw new Error("Select at least one category");
  }

  const existing = await User.findOne({ mobile });

  if (existing) {
    throw new Error("User already exists");
  }

  // ✅ enforce max 2 categories
  if (categories && categories.length > 2) {
    throw new Error("Maximum 2 categories allowed");
  }

  const selectedBrandIds = [...new Set(Array.isArray(dealerBrands) ? dealerBrands : [])];
  let selectedCompanyId = null;
  if (selectedBrandIds.length) {
    const [adminIds, selectedBrands, selectedCompanies] = await Promise.all([
      User.find({ role: "ADMIN" }).distinct("_id"),
      Brand.find({ _id: { $in: selectedBrandIds } }).populate("category", "name"),
      User.find({ _id: { $in: selectedBrandIds }, role: "COMPANY" })
        .select("categories")
        .lean()
    ]);
    const allowedBrands = selectedBrands.filter((brand) =>
      adminIds.some((adminId) => String(adminId) === String(brand.createdBy))
    );
    if (allowedBrands.length + selectedCompanies.length !== selectedBrandIds.length) {
      throw new Error("One or more selected brands are invalid");
    }
    if (selectedCompanies.length > 1) {
      throw new Error("Only one company brand can be selected");
    }
    const selectedCategories = (categories || []).map((name) => name.toLowerCase());
    if (selectedCategories.length && allowedBrands.some((brand) => !selectedCategories.includes(brand.category?.name?.toLowerCase()))) {
      throw new Error("Selected brands must belong to selected categories");
    }
    if (selectedCategories.length && selectedCompanies.some((company) =>
      !(company.categories || []).some((name) => selectedCategories.includes(name.toLowerCase()))
    )) {
      throw new Error("Selected company must belong to selected categories");
    }
    selectedCompanyId = selectedCompanies[0]?._id || null;
    selectedBrandIds.splice(0, selectedBrandIds.length, ...allowedBrands.map((brand) => String(brand._id)));
  }

  // 🔹 Get Lat/Lng from Pincode
  let lat = 0;
  let lng = 0;

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          postalcode: pincode,
          country: "India",
          format: "json",
          limit: 1
        },
        timeout: 5000,
        headers: {
          "User-Agent": "your-app-name"
        }
      }
    );

    if (response.data?.length > 0) {
      lat = parseFloat(response.data[0].lat);
      lng = parseFloat(response.data[0].lon);
    }
  } catch (error) {
    // silent fail
  }

  // 🔹 Create User (NO PASSWORD)
  const user = await User.create({
    mobile,
    role: "B2B",
    firmName,
    proprietorName,

    categories: categories || [],
    dealerBrands: selectedBrandIds,
    company: selectedCompanyId,

    location: {
      state,
      district,
      village,
      pincode,
      type: "Point",
      coordinates: [lng, lat]
    }
  });

  const token = user.generateAuthToken();

  return {
    message: "B2B Registered Successfully",
    token,
    user
  };
};

// Company Register
exports.registerCompany = async (data, file) => {
  const {
      mobile,
      companyName,
      contactPerson,
      email,
      categories
  } = data;

  const selectedCategories = Array.isArray(categories)
    ? categories
    : categories ? [categories] : [];

  const requiredFields = {
    mobile,
      companyName,
      contactPerson,
      categories: selectedCategories.length ? selectedCategories : null
  };

  const missingField = Object.entries(requiredFields)
    .find(([, value]) => !String(value || "").trim());

  if (missingField) {
    throw new Error(`${missingField[0]} is required`);
  }

  if (!/^\d{10}$/.test(String(mobile))) {
    throw new Error("Mobile number must contain exactly 10 digits");
  }

    if (!file) {
      throw new Error("Company logo is required");
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      throw new Error("Enter a valid email address");
    }

    if (selectedCategories.length < 1) {
      throw new Error("Select at least one category");
    }

    if (selectedCategories.length > 1) {
      throw new Error("Only 1 category allowed");
    }

  const existing = await User.findOne({ mobile: String(mobile) });

  if (existing) {
    throw new Error("User already exists");
  }

  const user = await User.create({
    mobile: String(mobile),
    role: "COMPANY",
      companyName: companyName.trim(),
      contactPerson: contactPerson.trim(),
      email: email ? email.trim() : "",
      categories: selectedCategories,
      profileimage: file.path,
      public_id: file.filename
  });

  const token = user.generateAuthToken();

  return {
    message: "Company Registered Successfully",
    token,
    user,
    nextStep: {
      action: "SELECT_SUBSCRIPTION",
      plansEndpoint: "/api/subscription",
      createOrderEndpoint: "/api/subscription/create-order",
      verifyPaymentEndpoint: "/api/subscription/verify-payment"
    }
  };
};

// auth.service.js

// ✅ GET ME
// exports.getMe = async (userId) => {
//   const user = await User.findById(userId).select("-password");
//   if (!user) throw new Error("User not found");
//   return user;
// };


exports.getMe = async (userId) => {

  const user = await User.findById(userId)

    .populate({
      path: "subscription.planId",
      select: "name price duration"
    })
    .populate({
      path: "dealerBrands",
      select: "name image category createdBy",
      populate: { path: "category", select: "name" }
    })

    .select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};


// // ✅ UPDATE PROFILE (without streamifier)
// exports.updateProfile = async (userId, data, file) => {
//   const user = await User.findById(userId);
//   if (!user) throw new Error("User not found");

//   // ❌ restricted
//   delete data.mobile;
//   delete data.role;

//   // parse location
//   if (typeof data.location === "string") {
//     data.location = JSON.parse(data.location);
//   }

//   // ✅ common
//   if (data.name) user.name = data.name;
//   if (data.email) user.email = data.email;
//   if (data.proprietorName) user.proprietorName = data.proprietorName;

//   // ✅ B2B
//   if (user.role === "ADMIN" || user.role === "B2B") {
//     if (data.firmName) user.firmName = data.firmName;

//     if (data.location) {
//       user.location = {
//         ...user.location,
//         ...data.location,
//         type: "Point",
//         coordinates: [
//           data.location.lng || user.location.coordinates[0],
//           data.location.lat || user.location.coordinates[1]
//         ]
//       };
//     }

//     if (data.password) {
//       user.password = await bcrypt.hash(data.password, 10);
//     }
//   }



//   // 🔥 IMAGE UPLOAD (NO STREAMIFIER)
//   if (file && file.path) {
//     // delete old image
//     if (user?.public_id) {
//       await cloudinary.uploader.destroy(user?.public_id);
//     }


//     // ✅ save new image
//     user.profileimage = file.path;
//     user.public_id = file.filename;



//   }

//   await user.save();

//   user.password = undefined;

//   return user;
// };



// ✅ UPDATE PROFILE
exports.updateProfile = async (
  userId,
  data,
  file
) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // ❌ restricted
  delete data.mobile;
  delete data.role;

  // 🔹 Parse Location
  if (
    typeof data.location === "string"
  ) {
    data.location =
      JSON.parse(data.location);
  }

  // ✅ Common
  if (data.name) {
    user.name = data.name;
  }

  if (data.email) {
    user.email = data.email;
  }

  if (data.proprietorName) {
    user.proprietorName =
      data.proprietorName;
  }

  if (user.role === "COMPANY") {
    if (data.companyName) user.companyName = data.companyName;
    if (data.contactPerson) user.contactPerson = data.contactPerson;
    if (data.email !== undefined) user.email = data.email;
    if (data.gstNumber !== undefined) user.gstNumber = data.gstNumber.toUpperCase();
    if (data.address !== undefined) user.address = data.address;
  }

  if (user.role === "B2B" && data.dealerBrands !== undefined) {
    let dealerBrands = data.dealerBrands;
    if (typeof dealerBrands === "string") {
      dealerBrands = JSON.parse(dealerBrands);
    }
    if (!Array.isArray(dealerBrands)) {
      throw new Error("dealerBrands must be an array");
    }

    const selectedIds = [...new Set(dealerBrands)];
    const allowedCreators = await User.find({ role: { $in: ["ADMIN", "COMPANY"] } }).distinct("_id");
    const selectedBrands = await Brand.find({
      _id: { $in: selectedIds },
      createdBy: { $in: allowedCreators }
    }).populate("category", "name");

    if (selectedBrands.length !== selectedIds.length) {
      throw new Error("One or more selected brands are unavailable");
    }

    const assignedCategories = (user.categories || []).map((name) => name.toLowerCase());
    if (assignedCategories.length && selectedBrands.some((brand) => !assignedCategories.includes(brand.category?.name?.toLowerCase()))) {
      throw new Error("Selected brands must belong to your registered categories");
    }

    user.dealerBrands = selectedIds;
  }

  // ✅ ADMIN / B2B
  if (
    user.role === "ADMIN" ||
    user.role === "B2B" ||
    user.role === "COMPANY"
  ) {

    if (data.firmName) {
      user.firmName = data.firmName;
    }

    // 🔥 LOCATION UPDATE
    if (data.location) {

      let lat =
        data.location.lat ||
        user?.location?.coordinates?.[1];

      let lng =
        data.location.lng ||
        user?.location?.coordinates?.[0];

      // 🔥 IF LAT/LNG NOT AVAILABLE
      // THEN GET FROM PINCODE
      if (
        (!lat || !lng) &&
        data.location.pincode
      ) {

        try {

          const response =
            await axios.get(
              "https://nominatim.openstreetmap.org/search",
              {
                params: {
                  postalcode:
                    data.location.pincode,
                  country: "India",
                  format: "json",
                  limit: 1
                },
                headers: {
                  "User-Agent":
                    "your-app-name"
                }
              }
            );

          if (
            response.data &&
            response.data.length > 0
          ) {

            lat = parseFloat(
              response.data[0].lat
            );

            lng = parseFloat(
              response.data[0].lon
            );
          }

        } catch (error) {

          // console.log(
          //   "Pincode location error:",
          //   error.message
          // );
        }
      }

      // ✅ Final Location Save
      user.location = {
        ...user.location,
        ...data.location,

        type: "Point",

        coordinates: [
          lng || 0,
          lat || 0
        ]
      };
    }

    // 🔥 PASSWORD UPDATE
    if (data.password) {

      user.password =
        await bcrypt.hash(
          data.password,
          10
        );
    }
  }

  // 🔥 IMAGE UPLOAD
  if (file && file.path) {

    // delete old image
    if (user?.public_id) {

      await cloudinary.uploader.destroy(
        user.public_id
      );
    }

    // save new image
    user.profileimage = file.path;
    user.public_id = file.filename;
  }

  // ✅ SAVE
  await user.save();

  user.password = undefined;

  return user;
};



// ✅ ACCOUNT DELETE REQUEST
exports.requestAccountDeletion = async (
    userId,
    reason = ""
  ) => {

    const user =
      await User.findById(userId);

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    // ❌ already requested
    if (
      user.deleteRequest
        ?.requested
    ) {

      throw new Error(
        "Delete request already submitted"
      );
    }

    // ✅ save request
    user.deleteRequest = {

      requested: true,

      reason:
        reason || "",

      requestedAt:
        new Date()
    };

    await user.save();

    return {
      message:
        "Account deletion request submitted successfully"
    };
  };



// ✅ GET DELETE REQUEST USERS
exports.getDeleteRequestUsers = async (adminId) => {

    const admin =
      await User.findById(
        adminId
      );

    if (!admin) {

      throw new Error(
        "Admin not found"
      );
    }

    // ❌ only admin
    if (
      admin.role !== "ADMIN"
    ) {

      throw new Error(
        "Only admin can access delete requests"
      );
    }

    const users =
      await User.find({

        "deleteRequest.requested":
          true

      })
        .select(`
          mobile
          role
          firmName
          proprietorName
          deleteRequest
          createdAt
        `)

        .sort({
          "deleteRequest.requestedAt":
            -1
        });

    return users;
  };



// ✅ DELETE USER (ADMIN ONLY)
exports.deleteUser = async (
  adminId,
  userId
) => {

  const admin =
    await User.findById(
      adminId
    );

  if (!admin) {

    throw new Error(
      "Admin not found"
    );
  }

  // ❌ only admin allowed
  if (
    admin.role !== "ADMIN"
  ) {

    throw new Error(
      "Only admin can delete users"
    );
  }

  const user =
    await User.findById(
      userId
    );

  if (!user) {

    throw new Error(
      "User not found"
    );
  }

  // 🔥 delete profile image
  if (user?.public_id) {

    await cloudinary
      .uploader
      .destroy(
        user.public_id
      );
  }

  // 🔥 get user's products
  const products =
    await Product.find({
      createdBy: userId
    });

  // 🔥 delete product images
  for (const product of products) {

    if (
      product.images &&
      product.images.length > 0
    ) {

      for (const img of product.images) {

        if (img.public_id) {

          await cloudinary
            .uploader
            .destroy(
              img.public_id
            );
        }
      }
    }
  }

  // 🔥 delete products
  await Product.deleteMany({
    createdBy: userId
  });

  // 🔥 delete OTPs
  await OTP.deleteMany({
    mobile: user.mobile
  });

  // 🔥 delete user
  await User.findByIdAndDelete(
    userId
  );

  return {
    message:
      "User deleted successfully"
  };
};
