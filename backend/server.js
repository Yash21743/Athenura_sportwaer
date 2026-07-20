require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");
const inquiryRoutes = require("./routes/inquiries");
const bulkOrderRoutes = require("./routes/bulkOrders");
const testimonialRoutes = require("./routes/testimonials");
const contactRoutes = require("./routes/contacts");
const dashboardRoutes = require("./routes/dashboard");
const faqRoutes = require("./routes/faqs");
const customerRoutes = require("./routes/customer");

const app = express();

// ── CORS: wide open in development, strict in production ──
if (process.env.NODE_ENV === "production") {
  app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
} else {
  app.use(cors({ origin: true, credentials: true }));
}

// ── Body parsing ──
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Static files ──
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ──
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/leads", inquiryRoutes);
app.use("/api/bulk-orders", bulkOrderRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/customer", customerRoutes);

// ── Health check ──
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date(),
  });
});

// ── 404 ──
app.use("/api", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Error handler ──
app.use(errorHandler);

// ── Start ──
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`CLIENT_URL from env: ${process.env.CLIENT_URL}`);
    console.log(`SETUP_KEY from env: ${process.env.SETUP_KEY}`);
  });
});