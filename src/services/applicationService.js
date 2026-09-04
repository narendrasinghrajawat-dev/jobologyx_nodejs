const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const { ApiError } = require("../utils/apiResponse");

const MAX_LIMIT = 50;

const applyToJob = async (applicantId, { jobId, coverLetter }) => {
  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, "Job not found");

  if (job.status !== "active") {
    throw new ApiError(400, "This job is not accepting applications");
  }

  const applicant = await User.findById(applicantId);
  if (!applicant.resumeUrl) {
    throw new ApiError(400, "Please upload a resume before applying");
  }

  const existing = await Application.findOne({ job: jobId, applicant: applicantId });
  if (existing) {
    throw new ApiError(409, "You have already applied to this job");
  }

  const application = await Application.create({
    job: jobId,
    applicant: applicantId,
    recruiter: job.createdBy,
    resumeUrl: applicant.resumeUrl,
    coverLetter,
    status: "applied",
  });

  return application;
};

const getMyApplications = async (applicantId, query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Number(query.limit) || 10, MAX_LIMIT);
  const skip = (page - 1) * limit;

  const filter = { applicant: applicantId };

  const [applications, total] = await Promise.all([
    Application.find(filter)
      .populate("job", "title companyName location jobType status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Application.countDocuments(filter),
  ]);

  return {
    applications,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
};

const getRecruiterApplications = async (recruiterId, query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Number(query.limit) || 10, MAX_LIMIT);
  const skip = (page - 1) * limit;

  const filter = { recruiter: recruiterId };
  if (query.job) filter.job = query.job;
  if (query.status) filter.status = query.status;

  const [applications, total] = await Promise.all([
    Application.find(filter)
      .populate("job", "title companyName location")
      .populate("applicant", "name email phone resumeUrl skills")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Application.countDocuments(filter),
  ]);

  return {
    applications,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
};

const getApplicationById = async (applicationId, requestingUser) => {
  const application = await Application.findById(applicationId)
    .populate("job", "title companyName location status")
    .populate("applicant", "name email phone resumeUrl skills");

  if (!application) throw new ApiError(404, "Application not found");

  const isOwner = application.applicant._id.toString() === requestingUser._id.toString();
  const isRecruiter = application.recruiter.toString() === requestingUser._id.toString();
  const isAdmin = requestingUser.role === "admin";

  if (!isOwner && !isRecruiter && !isAdmin) {
    throw new ApiError(403, "You do not have permission to view this application");
  }

  return application;
};

const updateApplicationStatus = async (applicationId, recruiterId, status) => {
  const application = await Application.findById(applicationId);
  if (!application) throw new ApiError(404, "Application not found");

  if (application.recruiter.toString() !== recruiterId.toString()) {
    throw new ApiError(403, "You can only manage applications for your own jobs");
  }

  application.status = status;
  await application.save();
  return application;
};

module.exports = {
  applyToJob,
  getMyApplications,
  getRecruiterApplications,
  getApplicationById,
  updateApplicationStatus,
};
