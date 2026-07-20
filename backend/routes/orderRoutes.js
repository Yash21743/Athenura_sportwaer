const express = require('express');
const router = express.Router();
const {
  getMyOrders, getOrder, createOrder, getAllOrders, updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/admin/all', authorize('admin'), getAllOrders);
router.patch('/admin/:id/status', authorize('admin'), updateOrderStatus);

router.get('/', getMyOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);

module.exports = router;