const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { ApiError } = require("../utils/apiResponse");

const register = async ({ name, email, password, role, phone }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role === "recruiter" ? "recruiter" : "job_seeker",
    phone,
  });

  const token = generateToken(user._id, user.role);
  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account has been deactivated");
  }

  const token = generateToken(user._id, user.role);
  return { user, token };
};

module.exports = { register, login };
