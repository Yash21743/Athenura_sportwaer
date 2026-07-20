const express = require("express");
const router = express.Router();
const {
  registerCustomer,
  loginCustomer,
  getMe,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/customerController");
const { protect } = require("../middleware/auth");

// Public routes
router.post("/register", registerCustomer);
router.post("/login", loginCustomer);

// Protected routes (Customer only / general authenticated user)
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

// Address Management routes
router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, addAddress);
router.put("/addresses/:addressId", protect, updateAddress);
router.delete("/addresses/:addressId", protect, deleteAddress);

module.exports = router;
