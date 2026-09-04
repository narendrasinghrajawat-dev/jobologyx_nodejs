const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    companyName: { type: String, required: true },
    companyLogo: { type: String, default: "" },
    location: { type: String, required: [true, "Location is required"] },
    jobType: {
      type: String,
      enum: ["full_time", "part_time", "contract", "internship", "freelance"],
      required: true,
    },
    workMode: {
      type: String,
      enum: ["onsite", "remote", "hybrid"],
      required: true,
    },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    experience: { type: String, default: "" },
    skills: { type: [String], default: [] },
    category: { type: String, default: "", trim: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
    applicationDeadline: { type: Date },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text", skills: "text" });
jobSchema.index({ location: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Job", jobSchema);
