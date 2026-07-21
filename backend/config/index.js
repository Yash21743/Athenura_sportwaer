require("dotenv").config();

const config = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: process.env.PORT || 5000,

  mongoUri: process.env.MONGODB_URI,

  jwtSecret: process.env.JWT_SECRET,

  jwtExpire: process.env.JWT_EXPIRE || "7d",

  setupKey: process.env.SETUP_KEY,

  clientUrl:
    process.env.CLIENT_URL || "http://localhost:5173",

  websiteUrl:
    process.env.WEBSITE_URL || "http://localhost:3000",

  brevo: {
    apiKey: process.env.BREVO_API_KEY,

    senderEmail:
      process.env.BREVO_SENDER_EMAIL,

    senderName:
      process.env.BREVO_SENDER_NAME ||
      "Comfy Sport Wear",
  },

  adminEmail: process.env.ADMIN_EMAIL,

  cloudinary: {
    cloudName:
      process.env.CLOUDINARY_CLOUD_NAME,

    apiKey:
      process.env.CLOUDINARY_API_KEY,

    apiSecret:
      process.env.CLOUDINARY_API_SECRET,
  },

  whatsappNumber:
    process.env.WHATSAPP_NUMBER,
};

// ===============================
// ENV VALIDATION
// ===============================

const requiredEnv = [
  "MONGODB_URI",
  "JWT_SECRET",
  "BREVO_API_KEY",
  "BREVO_SENDER_EMAIL",
];

const missingEnv = requiredEnv.filter(
  (key) => !process.env[key]
);

if (missingEnv.length > 0) {
  console.error(
    `❌ Missing environment variables: ${missingEnv.join(", ")}`
  );

  if (
    process.env.NODE_ENV === "production"
  ) {
    process.exit(1);
  }
}

module.exports = config;