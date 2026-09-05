const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const { ApiError } = require("../utils/apiResponse");

const MAX_LIMIT = 50;

const getDashboardStats = async () => {
  const [
    totalUsers,
    totalJobSeekers,
    totalRecruiters,
    totalJobs,
    activeJobs,
    totalApplications,
    pendingApplications,
  ] = await Promise.all([
    User.countDocuments({ role: { $ne: "admin" } }),
    User.countDocuments({ role: "job_seeker" }),
    User.countDocuments({ role: "recruiter" }),
    Job.countDocuments(),
    Job.countDocuments({ status: "active" }),
    Application.countDocuments(),
    Application.countDocuments({ status: "applied" }),
  ]);

  return {
    totalUsers,
    totalJobSeekers,
    totalRecruiters,
    totalJobs,
    activeJobs,
    totalApplications,
    pendingApplications,
  };
};

const paginate = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Number(query.limit) || 10, MAX_LIMIT);
  return { page, limit, skip: (page - 1) * limit };
};

const listUsers = async (query) => {
  const { page, limit, skip } = paginate(query);
  const filter = {};
  if (query.role) filter.role = query.role;
  if (query.isActive !== undefined) filter.isActive = query.isActive === "true";

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return { users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
};

const updateUserStatus = async (userId, isActive) => {
  const user = await User.findByIdAndUpdate(userId, { isActive }, { returnDocument: "after" });
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new ApiError(404, "User not found");
};

const listJobs = async (query) => {
  const { page, limit, skip } = paginate(query);
  const filter = {};
  if (query.status) filter.status = query.status;

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate("createdBy", "name email companyName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Job.countDocuments(filter),
  ]);

  return { jobs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
};

const updateJobStatus = async (jobId, status) => {
  const job = await Job.findByIdAndUpdate(jobId, { status }, { returnDocument: "after" });
  if (!job) throw new ApiError(404, "Job not found");
  return job;
};

const deleteJob = async (jobId) => {
  const job = await Job.findByIdAndDelete(jobId);
  if (!job) throw new ApiError(404, "Job not found");
};

const listApplications = async (query) => {
  const { page, limit, skip } = paginate(query);
  const filter = {};
  if (query.status) filter.status = query.status;

  const [applications, total] = await Promise.all([
    Application.find(filter)
      .populate("job", "title companyName")
      .populate("applicant", "name email")
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Application.countDocuments(filter),
  ]);

  return { applications, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
};

module.exports = {
  getDashboardStats,
  listUsers,
  updateUserStatus,
  deleteUser,
  listJobs,
  updateJobStatus,
  deleteJob,
  listApplications,
};
