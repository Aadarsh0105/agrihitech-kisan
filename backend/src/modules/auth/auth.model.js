const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },

  role: { type: String, enum: ["B2C", "B2B", "COMPANY", "ADMIN"], default: "B2C" },

  // 🔹 B2B fields
  firmName: String,
  proprietorName: String,
  companyName: String,
  contactPerson: String,
  email: String,
  gstNumber: String,
  address: String,
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  companies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  companyDealerStatus: {
    type: String,
    enum: ["ACTIVE", "SUSPENDED"],
    default: "ACTIVE"
  },
  password: String,
  categories: {
    type: [String],
    default: [],
    validate: {
      validator: function (v) {
        return v.length <= 2;
      },
      message: "Maximum 2 categories allowed"
    }
  },

  dealerBrands: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand"
  }],

  profileimage: {
    type: String,
    // required: true
  },
  public_id: {
    type: String,
    // required: true,
  },

  location: {
    state: String,
    district: String,
    village: String,
    pincode: String,

    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },

  isVerified: { type: Boolean, default: false },

  // 🔥 NEW: Subscription Field
  subscription: {
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription"
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING"
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    amount: Number,

    currency: {
      type: String,
      default: "INR"
    },

    startDate: Date,

    endDate: Date,

    isActive: {
      type: Boolean,
      default: false
    }
  },

  subscriptionHistory: [{
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription"
    },
    paymentStatus: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    amount: Number,
    currency: { type: String, default: "INR" },
    startDate: Date,
    endDate: Date,
    isActive: Boolean
  }],

  trialUsed: {
    type: Boolean,
    default: false
  },

  // 🔥 DELETE REQUEST
  deleteRequest: {

    requested: {
      type: Boolean,
      default: false
    },

    reason: {
      type: String,
      default: ""
    },

    requestedAt: {
      type: Date,
      default: null
    }
  }

}, { timestamps: true });

// ✅ INDEX
userSchema.index({ location: "2dsphere" });

// 🔐 TOKEN
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = mongoose.model("User", userSchema);
