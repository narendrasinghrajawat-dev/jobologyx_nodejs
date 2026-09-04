const { body } = require("express-validator");

const jobTypes = ["full_time", "part_time", "contract", "internship", "freelance"];
const workModes = ["onsite", "remote", "hybrid"];
const statuses = ["active", "closed", "draft"];

const createJobValidator = [
  body("title").trim().notEmpty().withMessage("Job title is required"),
  body("description").trim().notEmpty().withMessage("Job description is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("jobType").isIn(jobTypes).withMessage(`jobType must be one of: ${jobTypes.join(", ")}`),
  body("workMode").isIn(workModes).withMessage(`workMode must be one of: ${workModes.join(", ")}`),
  body("salaryMin").optional().isNumeric().withMessage("salaryMin must be a number"),
  body("salaryMax").optional().isNumeric().withMessage("salaryMax must be a number"),
  body("skills").optional().isArray().withMessage("skills must be an array"),
  body("status").optional().isIn(statuses).withMessage(`status must be one of: ${statuses.join(", ")}`),
];

const updateJobValidator = [
  body("title").optional().trim().notEmpty().withMessage("Job title cannot be empty"),
  body("description").optional().trim().notEmpty().withMessage("Job description cannot be empty"),
  body("location").optional().trim().notEmpty().withMessage("Location cannot be empty"),
  body("jobType").optional().isIn(jobTypes).withMessage(`jobType must be one of: ${jobTypes.join(", ")}`),
  body("workMode").optional().isIn(workModes).withMessage(`workMode must be one of: ${workModes.join(", ")}`),
  body("salaryMin").optional().isNumeric().withMessage("salaryMin must be a number"),
  body("salaryMax").optional().isNumeric().withMessage("salaryMax must be a number"),
  body("skills").optional().isArray().withMessage("skills must be an array"),
  body("status").optional().isIn(statuses).withMessage(`status must be one of: ${statuses.join(", ")}`),
];

module.exports = { createJobValidator, updateJobValidator };
