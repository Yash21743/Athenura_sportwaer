const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// ===============================
// ROUTES
// ===============================

const authRoutes = require("./routes/auth");
const userAuthRoutes = require("./routes/userAuthRoutes");
const userRoutes = require("./routes/userRoutes");
const addressRoutes = require("./routes/addressRoutes");

const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");

const inquiryRoutes = require("./routes/inquiries");
const bulkOrderRoutes = require("./routes/bulkOrders");
const testimonialRoutes = require("./routes/testimonials");
const contactRoutes = require("./routes/contacts");
const dashboardRoutes = require("./routes/dashboard");
const faqRoutes = require("./routes/faqs");

const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

// ===============================
// APP
// ===============================

const app = express();

// ===============================
// CORS
// ===============================

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : true,

    credentials: true,
  })
);

// ===============================
// BODY PARSER
// ===============================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ===============================
// STATIC UPLOADS
// ===============================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// ===============================
// AUTH ROUTES
// ===============================

// User Register / Login / OTP / Forgot Password
app.use(
  "/api/user-auth",
  userAuthRoutes
);

// Admin Authentication
app.use(
  "/api/auth",
  authRoutes
);

// ===============================
// USER DASHBOARD ROUTES
// ===============================

// GET /api/users/me
app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/admin/users",
  userRoutes
);

// GET /api/addresses
app.use(
  "/api/addresses",
  addressRoutes
);

// ===============================
// PRODUCT ROUTES
// ===============================

app.use(
  "/api/categories",
  categoryRoutes
);

app.use(
  "/api/products",
  productRoutes
);

// ===============================
// OTHER ROUTES
// ===============================

app.use(
  "/api/inquiries",
  inquiryRoutes
);

app.use(
  "/api/leads",
  inquiryRoutes
);

app.use(
  "/api/bulk-orders",
  bulkOrderRoutes
);

app.use(
  "/api/testimonials",
  testimonialRoutes
);

app.use(
  "/api/contact",
  contactRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/faqs",
  faqRoutes
);

// ===============================
// USER CART & ORDERS
// ===============================

app.use(
  "/api/cart",
  cartRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

// ===============================
// HEALTH CHECK
// ===============================

app.get(
  "/api/health",
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Server is running",
    });
  }
);

// ===============================
// 404 API HANDLER
// ===============================

app.use(
  "/api",
  (req, res) => {
    res.status(404).json({
      success: false,
      message: "API route not found",
      path: req.originalUrl,
    });
  }
);

// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use(errorHandler);

// ===============================
// START SERVER
// ===============================

const PORT =
  process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "Server startup failed:",
      error
    );

    process.exit(1);
  });