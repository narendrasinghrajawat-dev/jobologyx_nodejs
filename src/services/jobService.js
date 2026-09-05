const Job = require("../models/Job");
const User = require("../models/User");
const { ApiError } = require("../utils/apiResponse");

const MAX_LIMIT = 50;

const SORT_MAP = {
  latest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  salaryHigh: { salaryMax: -1 },
  salaryLow: { salaryMin: 1 },
};

const buildFilter = (query) => {
  const filter = {};

  if (query.search) {
    const regex = new RegExp(query.search, "i");
    filter.$or = [
      { title: regex },
      { description: regex },
      { companyName: regex },
      { skills: regex },
      { location: regex },
    ];
  }

  if (query.location) filter.location = new RegExp(query.location, "i");
  if (query.jobType) filter.jobType = query.jobType;
  if (query.workMode) filter.workMode = query.workMode;
  if (query.category) filter.category = new RegExp(query.category, "i");
  if (query.experience) filter.experience = query.experience;
  if (query.status) filter.status = query.status;

  if (query.salaryMin || query.salaryMax) {
    filter.salaryMax = {};
    if (query.salaryMin) filter.salaryMax.$gte = Number(query.salaryMin);
    if (query.salaryMax) filter.salaryMin = { $lte: Number(query.salaryMax) };
  }

  return filter;
};

const listJobs = async (query, requestingUser) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Number(query.limit) || 10, MAX_LIMIT);
  const skip = (page - 1) * limit;

  const filter = buildFilter(query);

  // `mine=true` scopes the listing to the authenticated recruiter's own jobs
  // (any status), so recruiters can see their drafts/closed jobs too.
  const isOwnListing = query.mine === "true" && requestingUser;
  if (isOwnListing) {
    filter.createdBy = requestingUser._id;
  }

  // Public listing should only ever surface active jobs unless explicitly overridden
  if (!query.status && !isOwnListing) filter.status = "active";

  const sort = SORT_MAP[query.sort] || SORT_MAP.latest;

  const [jobs, total] = await Promise.all([
    Job.find(filter).sort(sort).skip(skip).limit(limit),
    Job.countDocuments(filter),
  ]);

  return {
    jobs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

const getJobById = async (id) => {
  const job = await Job.findById(id);
  if (!job) throw new ApiError(404, "Job not found");
  return job;
};

const createJob = async (recruiterId, jobData) => {
  const recruiter = await User.findById(recruiterId);
  if (!recruiter) throw new ApiError(404, "Recruiter not found");

  const job = await Job.create({
    ...jobData,
    companyName: recruiter.companyName || jobData.companyName,
    companyLogo: recruiter.companyLogo,
    createdBy: recruiterId,
  });

  return job;
};

const updateJob = async (jobId, recruiterId, updates) => {
  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, "Job not found");

  if (job.createdBy.toString() !== recruiterId.toString()) {
    throw new ApiError(403, "You can only modify your own jobs");
  }

  Object.assign(job, updates);
  await job.save();
  return job;
};

const deleteJob = async (jobId, recruiterId) => {
  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, "Job not found");

  if (job.createdBy.toString() !== recruiterId.toString()) {
    throw new ApiError(403, "You can only delete your own jobs");
  }

  await job.deleteOne();
};

module.exports = { listJobs, getJobById, createJob, updateJob, deleteJob };
