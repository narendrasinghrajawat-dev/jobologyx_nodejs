const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiResponse");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authorized, no token provided");
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Session expired, please log in again");
    }
    throw new ApiError(401, "Not authorized, invalid token");
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new ApiError(401, "Not authorized, user no longer exists");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account has been deactivated");
  }

  req.user = user;
  next();
});

// Attaches req.user when a valid token is present, but never rejects the
// request — used by public routes that behave differently for logged-in users.
const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (user && user.isActive) {
      req.user = user;
    }
  } catch (error) {
    // Invalid/expired token on an optional-auth route: proceed as a guest.
  }

  next();
});

module.exports = protect;
module.exports.optionalAuth = optionalAuth;
