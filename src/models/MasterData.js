const mongoose = require("mongoose");

// Read-only reference/lookup data for frontend forms (role picker, job-type
// dropdown, etc). This is NOT the source of truth for validation — User.role,
// Job.jobType/workMode/status, and Application.status stay hardcoded Mongoose
// enums, exactly as before. This collection only mirrors those fixed values
// in a shape a <select> can fetch and render.
const masterDataSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "role",
        "jobType",
        "workMode",
        "jobStatus",
        "applicationStatus",
        "category",
        "experienceLevel",
      ],
    },
    code: { type: Number, required: true },
    name: { type: String, required: true }, // matches the string enum value used elsewhere (e.g. "recruiter", "full_time")
    label: { type: String, required: true }, // human-readable, for display in a dropdown
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

masterDataSchema.index({ type: 1, code: 1 }, { unique: true });
masterDataSchema.index({ type: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("MasterData", masterDataSchema, "master_data");
