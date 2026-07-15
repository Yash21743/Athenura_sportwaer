
const express = require('express');
const router = express.Router();
const {
  getCategories, getAdminCategories, getCategory,
  createCategory, updateCategory, deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

router.get('/', getCategories);
router.get('/:id', getCategory);
router.get('/admin/all', protect, getAdminCategories);
router.post('/', protect, uploadSingle, createCategory);
router.put('/:id', protect, uploadSingle, updateCategory);
router.delete('/:id', protect, deleteCategory);

module.exports = router;
