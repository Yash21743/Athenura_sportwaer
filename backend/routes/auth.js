const express = require("express");

const router = express.Router();

const {
  login,
  getMe,
  updateProfile,
  setupAdmin,
} = require("../controllers/authController");

const {
  protect,
  adminOnly,
} = require("../middleware/auth");

// ===============================
// ADMIN REGISTER
// ===============================

router.post(
  "/setup",
  setupAdmin
);

// ===============================
// ADMIN LOGIN
// ===============================

router.post(
  "/login",
  login
);

// ===============================
// ADMIN CURRENT USER
// ===============================

router.get(
  "/me",
  protect,
  adminOnly,
  getMe
);

// ===============================
// ADMIN UPDATE PROFILE
// ===============================

router.put(
  "/profile",
  protect,
  adminOnly,
  updateProfile
);

module.exports = router;