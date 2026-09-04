const { validationResult } = require("express-validator");
const { ApiError } = require("../utils/apiResponse");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(", ");
    throw new ApiError(422, message);
  }
  next();
};

module.exports = validate;
