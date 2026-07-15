
const express = require('express');
const router = express.Router();
const {
  createBulkOrder, getBulkOrders, getBulkOrder,
  updateBulkOrder, deleteBulkOrder,
} = require('../controllers/bulkOrderController');
const { protect } = require('../middleware/auth');

router.post('/', createBulkOrder);
router.get('/', protect, getBulkOrders);
router.get('/:id', protect, getBulkOrder);
router.put('/:id', protect, updateBulkOrder);
router.delete('/:id', protect, deleteBulkOrder);

module.exports = router;
