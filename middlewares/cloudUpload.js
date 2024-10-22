const cloudinary = require("../confin/cloudinary");

const cloudUpload = async (filePath) => {
    try {
      const result = await cloudinary.uploader.upload(filePath);
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  module.exports = cloudUpload;