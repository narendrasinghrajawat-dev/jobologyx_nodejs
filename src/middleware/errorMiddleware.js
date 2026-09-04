const env = require("../config/env");
const { ApiError } = require("../utils/apiResponse");

const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 404;
    message = `Resource not found with id: ${err.value}`;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} already exists` : "Duplicate value error";
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 422;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Multer errors
  if (err.name === "MulterError") {
    statusCode = 400;
    message = err.message;
  }

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    ...(env.NODE_ENV === "development" && statusCode === 500 ? { stack: err.stack } : {}),
  });
};

module.exports = { notFound, errorHandler };
