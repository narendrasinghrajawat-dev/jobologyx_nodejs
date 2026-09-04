class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
  }
}

const sendSuccess = (res, { statusCode = 200, message = "Operation successful", data = {} } = {}) => {
  return res.status(statusCode).json({ success: true, message, data });
};

module.exports = { ApiError, sendSuccess };
