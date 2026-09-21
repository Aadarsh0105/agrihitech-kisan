const express = require('express');
const mongoose = require('mongoose');
const Category = require('./category.model');
const SubCategory = require('./subcategory.model');
const Product = require('../product/product.model');
const upload = require('../../middleware/upload');
const cloudinary = require('../../config/cloudinary');
const { verifyToken, isAdmin } = require('../../middleware/isAdmin');
const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const filter = {};
    if (req.query.categoryId) {
      if (!mongoose.Types.ObjectId.isValid(req.query.categoryId)) return res.status(400).json({ error: 'Invalid category ID' });
      filter.category = req.query.categoryId;
    }
    const subCategories = await SubCategory.find(filter).populate('category', 'name').sort({ name: 1 }).lean();
    res.json({ subCategories });
  } catch (error) { res.status(500).json({ error: error.message }); }
});
router.post('/', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const categoryId = req.body.categoryId;
    if (!name || !mongoose.Types.ObjectId.isValid(categoryId)) return res.status(400).json({ error: 'Name and category are required' });
    const category = await Category.findById(categoryId);
    if (!category || /medicine/i.test(category.name)) return res.status(400).json({ error: 'Subcategories are not available for this category' });
    const subCategory = await SubCategory.create({ name, category: categoryId, image: req.file?.path, public_id: req.file?.filename });
    res.status(201).json({ subCategory });
  } catch (error) { res.status(error.code === 11000 ? 409 : 400).json({ error: error.code === 11000 ? 'Subcategory already exists' : error.message }); }
});
router.put('/:id', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) return res.status(404).json({ error: 'Subcategory not found' });
    if (req.body.name !== undefined) subCategory.name = String(req.body.name).trim();
    if (req.body.categoryId !== undefined) {
      const category = await Category.findById(req.body.categoryId);
      if (!category || /medicine/i.test(category.name)) return res.status(400).json({ error: 'Invalid parent category' });
      subCategory.category = category._id;
    }
    if (!subCategory.name) return res.status(400).json({ error: 'Name is required' });
    const previousImageId = subCategory.public_id;
    if (req.file) {
      subCategory.image = req.file.path;
      subCategory.public_id = req.file.filename;
    }
    await subCategory.save();
    if (req.file && previousImageId) await cloudinary.uploader.destroy(previousImageId);
    res.json({ subCategory });
  } catch (error) { res.status(400).json({ error: error.message }); }
});
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    if (await Product.exists({ subCategory: req.params.id })) return res.status(409).json({ error: 'Subcategory is used by products' });
    const removed = await SubCategory.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Subcategory not found' });
    if (removed.public_id) await cloudinary.uploader.destroy(removed.public_id);
    res.json({ message: 'Subcategory deleted' });
  } catch (error) { res.status(400).json({ error: error.message }); }
});
module.exports = router;
