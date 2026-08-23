const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, sparse: true, trim: true, lowercase: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  public_id: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

newsSchema.index({ createdAt: -1 });
module.exports = mongoose.model("News", newsSchema);
