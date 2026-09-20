const mongoose = require('mongoose');
const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true }
}, { timestamps: true });
subCategorySchema.index({ category: 1, name: 1 }, { unique: true });
module.exports = mongoose.model('SubCategory', subCategorySchema);
