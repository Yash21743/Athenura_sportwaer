const express = require('express');
const router = express.Router();
const {
  getProducts, getAdminProducts, getProduct, getAdminProduct,
  createProduct, updateProduct, deleteProduct,
  getFeaturedProducts, getProductsByCategory,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');

router.get('/featured', getFeaturedProducts);
router.get('/category/:slug', getProductsByCategory);
router.get('/', getProducts);
router.get('/admin/all', protect, getAdminProducts);
router.get('/admin/:id', protect, getAdminProduct);
router.get('/:slug', getProduct);
router.post('/', protect, uploadMultiple, createProduct);
router.put('/:id', protect, uploadMultiple, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;