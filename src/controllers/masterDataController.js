const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess, ApiError } = require("../utils/apiResponse");
const masterDataService = require("../services/masterDataService");

const getAll = asyncHandler(async (req, res) => {
  const masterData = await masterDataService.getAll();
  sendSuccess(res, { message: "Master data fetched", data: masterData });
});

const getByType = asyncHandler(async (req, res) => {
  const { type } = req.params;
  if (!masterDataService.TYPE_TO_KEY[type]) {
    throw new ApiError(404, `Unknown master data type: ${type}`);
  }

  const items = await masterDataService.getByType(type);
  sendSuccess(res, { message: "Master data fetched", data: { items } });
});

module.exports = { getAll, getByType };
