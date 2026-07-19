const { v2: cloudinary } = require("cloudinary");

// Use process.env directly for robustness (no dependency on config/index.js shape)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ─── Helper: upload from file path ───
const uploadImage = async (filePath, folder = "comfy-sportwear") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    throw error;
  }
};

// ─── Helper: upload from buffer ───
const uploadBuffer = async (buffer, folder = "comfy-sportwear") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      }
    );
    stream.end(buffer);
  });
};

// ─── Helper: delete image ───
const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
    throw error;
  }
};

// ✅ Attach helpers as properties so callers can still use them
cloudinary.uploadImage = uploadImage;
cloudinary.uploadBuffer = uploadBuffer;
cloudinary.deleteImage = deleteImage;

// ✅ Export the cloudinary v2 instance DIRECTLY (NOT wrapped in an object)
module.exports = cloudinary;