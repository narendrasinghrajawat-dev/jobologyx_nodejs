const multer = require("multer");
const { ApiError } = require("../utils/apiResponse");

const storage = multer.memoryStorage();

const imageFileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  }
  cb(new ApiError(422, "Only JPEG, PNG, or WEBP images are allowed"));
};

const resumeFileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["application/pdf", "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  }
  cb(new ApiError(422, "Only PDF or Word documents are allowed for resumes"));
};

const uploadImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

const uploadResume = multer({
  storage,
  fileFilter: resumeFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = { uploadImage, uploadResume };
