
const express = require('express');
const router = express.Router();
const {
  getTestimonials, getAdminTestimonials, getTestimonial,
  createTestimonial, updateTestimonial, deleteTestimonial,
} = require('../controllers/testimonialController');
const { protect } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

router.get('/', getTestimonials);
router.get('/admin/all', protect, getAdminTestimonials);
router.get('/:id', protect, getTestimonial);
router.post('/', protect, uploadSingle, createTestimonial);
router.put('/:id', protect, uploadSingle, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

module.exports = router;
