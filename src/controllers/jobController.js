const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const jobService = require("../services/jobService");

const listJobs = asyncHandler(async (req, res) => {
  const { jobs, pagination } = await jobService.listJobs(req.query);
  sendSuccess(res, { message: "Jobs fetched", data: { jobs, pagination } });
});

const getJobById = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.params.id);
  sendSuccess(res, { message: "Job fetched", data: { job } });
});

const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.user._id, req.body);
  sendSuccess(res, { statusCode: 201, message: "Job created", data: { job } });
});

const updateJob = asyncHandler(async (req, res) => {
  const job = await jobService.updateJob(req.params.id, req.user._id, req.body);
  sendSuccess(res, { message: "Job updated", data: { job } });
});

const deleteJob = asyncHandler(async (req, res) => {
  await jobService.deleteJob(req.params.id, req.user._id);
  sendSuccess(res, { message: "Job deleted", data: null });
});

module.exports = { listJobs, getJobById, createJob, updateJob, deleteJob };
