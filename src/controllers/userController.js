const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const userService = require("../services/userService");

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getMe(req.user._id);
  sendSuccess(res, { message: "Profile fetched", data: { user } });
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateMe(req.user._id, req.body);
  sendSuccess(res, { message: "Profile updated", data: { user } });
});

const uploadProfileImage = asyncHandler(async (req, res) => {
  const user = await userService.uploadProfileImage(req.user._id, req.file);
  sendSuccess(res, { message: "Profile image uploaded", data: { user } });
});

const uploadResume = asyncHandler(async (req, res) => {
  const user = await userService.uploadResume(req.user._id, req.user.role, req.file);
  sendSuccess(res, { message: "Resume uploaded", data: { user } });
});

const uploadCompanyLogo = asyncHandler(async (req, res) => {
  const user = await userService.uploadCompanyLogo(req.user._id, req.user.role, req.file);
  sendSuccess(res, { message: "Company logo uploaded", data: { user } });
});

module.exports = { getMe, updateMe, uploadProfileImage, uploadResume, uploadCompanyLogo };
