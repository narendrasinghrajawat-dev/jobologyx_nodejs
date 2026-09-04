const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const applicationService = require("../services/applicationService");

const applyToJob = asyncHandler(async (req, res) => {
  const application = await applicationService.applyToJob(req.user._id, req.body);
  sendSuccess(res, { statusCode: 201, message: "Application submitted", data: { application } });
});

const getMyApplications = asyncHandler(async (req, res) => {
  const { applications, pagination } = await applicationService.getMyApplications(req.user._id, req.query);
  sendSuccess(res, { message: "Applications fetched", data: { applications, pagination } });
});

const getRecruiterApplications = asyncHandler(async (req, res) => {
  const { applications, pagination } = await applicationService.getRecruiterApplications(req.user._id, req.query);
  sendSuccess(res, { message: "Applications fetched", data: { applications, pagination } });
});

const getApplicationById = asyncHandler(async (req, res) => {
  const application = await applicationService.getApplicationById(req.params.id, req.user);
  sendSuccess(res, { message: "Application fetched", data: { application } });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await applicationService.updateApplicationStatus(
    req.params.id,
    req.user._id,
    req.body.status
  );
  sendSuccess(res, { message: "Application status updated", data: { application } });
});

module.exports = {
  applyToJob,
  getMyApplications,
  getRecruiterApplications,
  getApplicationById,
  updateApplicationStatus,
};
