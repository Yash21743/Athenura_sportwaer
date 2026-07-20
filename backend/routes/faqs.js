const express = require("express");
const router = express.Router();
const { getFaqs, createFaq, updateFaq, deleteFaq } = require("../controllers/faqController");
const { protect, adminOnly } = require("../middleware/auth");

// Public route to view FAQs
router.get("/", getFaqs);

// Protected Admin-only routes
router.post("/", protect, adminOnly, createFaq);
router.put("/:id", protect, adminOnly, updateFaq);
router.delete("/:id", protect, adminOnly, deleteFaq);

module.exports = router;
