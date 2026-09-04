const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["job_seeker", "recruiter", "admin"],
      default: "job_seeker",
    },
    phone: { type: String, trim: true },
    profileImage: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    bio: { type: String, default: "" },
    skills: { type: [String], default: [] },
    location: { type: String, default: "" },

    // Recruiter-only fields
    companyName: { type: String, default: "" },
    companyWebsite: { type: String, default: "" },
    companyLogo: { type: String, default: "" },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
