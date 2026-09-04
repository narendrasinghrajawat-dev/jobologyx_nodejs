const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const authService = require("../services/authService");

const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.register(req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: "Registration successful",
    data: { user, token },
  });
});

const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);
  sendSuccess(res, {
    message: "Login successful",
    data: { user, token },
  });
});

const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, { message: "Current user fetched", data: { user: req.user } });
});

module.exports = { register, login, getMe };
