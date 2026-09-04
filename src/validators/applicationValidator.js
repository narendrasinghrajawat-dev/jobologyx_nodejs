const { body } = require("express-validator");

const applyValidator = [
  body("jobId").notEmpty().withMessage("jobId is required").isMongoId().withMessage("jobId must be a valid id"),
  body("coverLetter").optional().trim(),
];

const updateStatusValidator = [
  body("status")
    .isIn(["applied", "reviewing", "shortlisted", "rejected", "hired"])
    .withMessage("Invalid application status"),
];

module.exports = { applyValidator, updateStatusValidator };
