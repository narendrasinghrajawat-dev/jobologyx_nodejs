const User = require("../models/User");
const { ApiError } = require("../utils/apiResponse");
const storageService = require("./storageService");

const EDITABLE_FIELDS = [
  "name",
  "phone",
  "bio",
  "skills",
  "location",
  "companyName",
  "companyWebsite",
  "companyLogo",
];

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

const updateMe = async (userId, updates) => {
  const payload = {};
  for (const field of EDITABLE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(updates, field)) {
      payload[field] = updates[field];
    }
  }

  const user = await User.findByIdAndUpdate(userId, payload, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!user) throw new ApiError(404, "User not found");
  return user;
};

const uploadProfileImage = async (userId, file) => {
  if (!file) throw new ApiError(400, "No image file provided");

  const url = await storageService.uploadBuffer(file.buffer, "profile-images");

  const user = await User.findByIdAndUpdate(
    userId,
    { profileImage: url },
    { returnDocument: "after" }
  );

  return user;
};

const uploadResume = async (userId, role, file) => {
  if (role !== "job_seeker") {
    throw new ApiError(403, "Only job seekers can upload a resume");
  }
  if (!file) throw new ApiError(400, "No resume file provided");

  const url = await storageService.uploadBuffer(file.buffer, "resumes");

  const user = await User.findByIdAndUpdate(
    userId,
    { resumeUrl: url, resumeFileName: file.originalname },
    { returnDocument: "after" }
  );

  return user;
};

const uploadCompanyLogo = async (userId, role, file) => {
  if (role !== "recruiter") {
    throw new ApiError(403, "Only recruiters can upload a company logo");
  }
  if (!file) throw new ApiError(400, "No logo file provided");

  const url = await storageService.uploadBuffer(file.buffer, "company-logos");

  const user = await User.findByIdAndUpdate(
    userId,
    { companyLogo: url },
    { returnDocument: "after" }
  );

  return user;
};

module.exports = { getMe, updateMe, uploadProfileImage, uploadResume, uploadCompanyLogo };
