const express = require("express");
const router = express.Router();

const {
  getMyOrders,
  getOrder,
  createOrder,
  deleteOrder, 
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const {
  protect,
  authorize,
} = require("../middleware/auth");

// ===============================
// USER ORDERS
// ===============================

router.get("/", protect, getMyOrders);
router.get("/:id", protect, getOrder);
router.post("/", protect, createOrder);


router.delete("/:id", protect, deleteOrder);

// ===============================
// ADMIN ORDERS
// ===============================

router.get(
  "/admin/all",
  protect,
  authorize("admin"),
  getAllOrders
);

router.patch(
  "/admin/:id/status",
  protect,
  authorize("admin"),
  updateOrderStatus
);

module.exports = router;