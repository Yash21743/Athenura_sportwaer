module.exports = {
    // Server
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || 5000,
  
    // Database
    mongoUri: process.env.MONGODB_URI,
  
    // JWT
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || "7d",
  
    // Admin Setup
    setupKey: process.env.SETUP_KEY,
  
    // URLs
    clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
    websiteUrl: process.env.WEBSITE_URL || "http://localhost:3000",
  
    // Brevo
    brevo: {
      apiKey: process.env.BREVO_API_KEY,
      senderEmail: process.env.BREVO_SENDER_EMAIL,
      senderName: process.env.BREVO_SENDER_NAME || "Comfy Sport Wear",
    },
  
    // Admin
    adminEmail: process.env.ADMIN_EMAIL,
  
    // Cloudinary
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
  
    // WhatsApp
    whatsappNumber: process.env.WHATSAPP_NUMBER,
  
    // Google Maps
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  };