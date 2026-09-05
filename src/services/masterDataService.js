const MasterData = require("../models/MasterData");

const TYPE_TO_KEY = {
  role: "roles",
  jobType: "jobTypes",
  workMode: "workModes",
  jobStatus: "jobStatuses",
  applicationStatus: "applicationStatuses",
  category: "categories",
  experienceLevel: "experienceLevels",
};

const toDto = (item) => ({ code: item.code, name: item.name, label: item.label });

const getAll = async () => {
  const items = await MasterData.find().sort({ type: 1, sortOrder: 1, code: 1 });

  const grouped = {};
  Object.values(TYPE_TO_KEY).forEach((key) => {
    grouped[key] = [];
  });

  items.forEach((item) => {
    const key = TYPE_TO_KEY[item.type];
    grouped[key].push(toDto(item));
  });

  return grouped;
};

const getByType = async (type) => {
  const items = await MasterData.find({ type }).sort({ sortOrder: 1, code: 1 });
  return items.map(toDto);
};

module.exports = { getAll, getByType, TYPE_TO_KEY };
