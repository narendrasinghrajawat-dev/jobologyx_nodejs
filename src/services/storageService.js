const cloudinary = require("../config/cloudinary");

/**
 * Storage abstraction. Everything above this module talks only in terms of
 * "upload a buffer, get back a URL" — swapping Cloudinary for AWS S3/MinIO
 * later only means rewriting this file.
 */
const uploadBuffer = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `jobologyx/${folder}`, resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

module.exports = { uploadBuffer };
