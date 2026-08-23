const User = require("../auth/auth.model");
const Brand = require("../brand/brand.model");
const Product = require("../product/product.model");

const allowedRoles = ["B2B", "COMPANY", "B2C"];
const safeFields = "-password -public_id -deleteRequest -subscription.razorpaySignature";

exports.getAccounts = async (query) => {
  const role = String(query.role || "").toUpperCase();
  if (!allowedRoles.includes(role)) throw new Error("A valid account role is required");

  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  const search = String(query.search || "").trim();
  const filter = { role };

  if (search) {
    filter.$or = ["mobile", "firmName", "proprietorName", "companyName", "contactPerson", "email"].map((field) => ({
      [field]: { $regex: search, $options: "i" }
    }));
  }

  const [accounts, total] = await Promise.all([
    User.find(filter)
      .select(safeFields)
      .populate({ path: "dealerBrands", select: "name image category", populate: { path: "category", select: "name" } })
      .populate({ path: "subscription.planId", select: "name price duration" })
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter)
  ]);

  return { accounts, pagination: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) } };
};

exports.getAccountById = async (id) => {
  const account = await User.findOne({ _id: id, role: { $in: allowedRoles } })
    .select(safeFields)
    .populate({ path: "dealerBrands", select: "name image category createdBy", populate: { path: "category", select: "name" } })
    .populate({ path: "subscription.planId", select: "name price duration" })
    .populate({ path: "subscriptionHistory.planId", select: "name price duration" });

  if (!account) throw new Error("Account not found");

  const [ownedBrands, products] = await Promise.all([
    Brand.find({ createdBy: account._id }).select("name image category createdAt").populate("category", "name").sort({ createdAt: -1 }),
    Product.find({ createdBy: account._id }).select("name images category brand price quantity createdAt").populate("category", "name").populate("brand", "name").sort({ createdAt: -1 })
  ]);

  return { account, ownedBrands, products };
};
