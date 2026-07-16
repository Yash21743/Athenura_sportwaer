const { v2: cloudinary } = require("cloudinary");
const config = require("./index");

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

const uploadImage = async (filePath, folder = "comfy-sportwear") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
      max_file_size: 5000000, // 5MB
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

const uploadBuffer = async (buffer, folder = "comfy-sportwear") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
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

    uploadStream.end(buffer);
  });
};

const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
    throw error;
  }
};

module.exports = { cloudinary, uploadImage, uploadBuffer, deleteImage };