
const express = require('express');
const router = express.Router();
const {
  createInquiry, getInquiries, getInquiry,
  updateInquiry, deleteInquiry, getInquiryStats,
} = require('../controllers/inquiryController');
const { protect } = require('../middleware/auth');

router.post('/', createInquiry);
router.get('/stats', protect, getInquiryStats);
router.get('/', protect, getInquiries);
router.get('/:id', protect, getInquiry);
router.put('/:id', protect, updateInquiry);
router.delete('/:id', protect, deleteInquiry);

module.exports = router;
