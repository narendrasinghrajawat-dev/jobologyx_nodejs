const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const adminService = require("../services/adminService");

const getDashboard = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  sendSuccess(res, { message: "Dashboard stats fetched", data: { stats } });
});

const listUsers = asyncHandler(async (req, res) => {
  const { users, pagination } = await adminService.listUsers(req.query);
  sendSuccess(res, { message: "Users fetched", data: { users, pagination } });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await adminService.updateUserStatus(req.params.id, req.body.isActive);
  sendSuccess(res, { message: "User status updated", data: { user } });
});

const deleteUser = asyncHandler(async (req, res) => {
  await adminService.deleteUser(req.params.id);
  sendSuccess(res, { message: "User deleted", data: null });
});

const listJobs = asyncHandler(async (req, res) => {
  const { jobs, pagination } = await adminService.listJobs(req.query);
  sendSuccess(res, { message: "Jobs fetched", data: { jobs, pagination } });
});

const updateJobStatus = asyncHandler(async (req, res) => {
  const job = await adminService.updateJobStatus(req.params.id, req.body.status);
  sendSuccess(res, { message: "Job status updated", data: { job } });
});

const deleteJob = asyncHandler(async (req, res) => {
  await adminService.deleteJob(req.params.id);
  sendSuccess(res, { message: "Job deleted", data: null });
});

const listApplications = asyncHandler(async (req, res) => {
  const { applications, pagination } = await adminService.listApplications(req.query);
  sendSuccess(res, { message: "Applications fetched", data: { applications, pagination } });
});

module.exports = {
  getDashboard,
  listUsers,
  updateUserStatus,
  deleteUser,
  listJobs,
  updateJobStatus,
  deleteJob,
  listApplications,
};
