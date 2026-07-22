const express = require("express");

const {
  getMe,
  updateMe,
  updatePassword,
  getAllUsers,
  deleteUser,
} = require("../controllers/userAuthController");

const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.put("/me/password", protect, updatePassword);

// Admin user management
router.get("/admin/all", protect, getAllUsers);
router.get("/", protect, getAllUsers);
router.delete("/:id", protect, deleteUser);

module.exports = router;