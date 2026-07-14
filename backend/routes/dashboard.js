
const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getRecentActivities, getInquiryTrend,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, getDashboardStats);
router.get('/recent-activities', protect, getRecentActivities);
router.get('/inquiry-trend', protect, getInquiryTrend);

module.exports = router;
