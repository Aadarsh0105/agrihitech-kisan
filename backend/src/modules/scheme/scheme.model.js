const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, sparse: true, trim: true, lowercase: true },
  tags: [{ type: String, trim: true }],
  content: { type: String, required: true },
  benefits: { type: String, default: "" },
  eligibility: { type: String, default: "" },
  applicationProcess: { type: String, default: "" },
  requiredDocuments: { type: String, default: "" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });
schema.index({ createdAt: -1 });
module.exports = mongoose.model("Scheme", schema);
