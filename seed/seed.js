require("dotenv").config();
const mongoose = require("mongoose");
const env = require("../src/config/env");
const User = require("../src/models/User");
const Job = require("../src/models/Job");
const Application = require("../src/models/Application");

const jobSeekersData = [
  { name: "Aarav Sharma", email: "aarav.seeker@example.com", skills: ["JavaScript", "React", "Node.js"], location: "Jaipur" },
  { name: "Priya Verma", email: "priya.seeker@example.com", skills: ["Flutter", "Dart", "Firebase"], location: "Bengaluru" },
  { name: "Rohan Mehta", email: "rohan.seeker@example.com", skills: ["Python", "Django", "PostgreSQL"], location: "Pune" },
  { name: "Sneha Kapoor", email: "sneha.seeker@example.com", skills: ["Java", "Spring Boot", "AWS"], location: "Delhi" },
  { name: "Vikram Singh", email: "vikram.seeker@example.com", skills: ["UI/UX", "Figma", "HTML/CSS"], location: "Mumbai" },
];

const recruitersData = [
  {
    name: "Neha Gupta",
    email: "neha.recruiter@example.com",
    companyName: "TechNova Solutions",
    companyWebsite: "https://technova.example.com",
    location: "Bengaluru",
  },
  {
    name: "Karan Malhotra",
    email: "karan.recruiter@example.com",
    companyName: "CloudBridge Systems",
    companyWebsite: "https://cloudbridge.example.com",
    location: "Hyderabad",
  },
];

const jobTemplates = [
  { title: "Frontend Developer", jobType: "full_time", workMode: "remote", category: "Engineering", experience: "1-3 years", salaryMin: 500000, salaryMax: 900000, skills: ["React", "JavaScript", "CSS"] },
  { title: "Backend Developer", jobType: "full_time", workMode: "hybrid", category: "Engineering", experience: "2-4 years", salaryMin: 700000, salaryMax: 1200000, skills: ["Node.js", "MongoDB", "Express"] },
  { title: "Flutter Developer", jobType: "full_time", workMode: "remote", category: "Engineering", experience: "1-3 years", salaryMin: 600000, salaryMax: 1000000, skills: ["Flutter", "Dart"] },
  { title: "DevOps Engineer", jobType: "full_time", workMode: "onsite", category: "Infrastructure", experience: "3-5 years", salaryMin: 900000, salaryMax: 1500000, skills: ["AWS", "Docker", "CI/CD"] },
  { title: "UI/UX Designer", jobType: "full_time", workMode: "hybrid", category: "Design", experience: "1-3 years", salaryMin: 500000, salaryMax: 800000, skills: ["Figma", "UI/UX"] },
  { title: "QA Engineer Intern", jobType: "internship", workMode: "onsite", category: "Quality Assurance", experience: "0-1 years", salaryMin: 150000, salaryMax: 250000, skills: ["Manual Testing", "Selenium"] },
  { title: "Data Analyst", jobType: "full_time", workMode: "remote", category: "Data", experience: "2-4 years", salaryMin: 600000, salaryMax: 1000000, skills: ["SQL", "Python", "Excel"] },
  { title: "Product Manager", jobType: "full_time", workMode: "hybrid", category: "Product", experience: "4-6 years", salaryMin: 1200000, salaryMax: 2000000, skills: ["Roadmapping", "Agile"] },
  { title: "Contract Java Developer", jobType: "contract", workMode: "remote", category: "Engineering", experience: "2-5 years", salaryMin: 800000, salaryMax: 1400000, skills: ["Java", "Spring Boot"] },
  { title: "Freelance Content Writer", jobType: "freelance", workMode: "remote", category: "Marketing", experience: "1-2 years", salaryMin: 200000, salaryMax: 400000, skills: ["SEO", "Content Writing"] },
];

const locations = ["Jaipur", "Bengaluru", "Pune", "Delhi", "Mumbai", "Hyderabad", "Remote"];

const run = async () => {
  await mongoose.connect(env.MONGODB_URI);
  console.log("Connected to MongoDB for seeding...");

  await Promise.all([User.deleteMany({}), Job.deleteMany({}), Application.deleteMany({})]);
  console.log("Cleared existing users, jobs, and applications.");

  const admin = await User.create({
    name: "Admin User",
    email: "admin@jobologyx.example.com",
    password: "Admin@123",
    role: "admin",
    isActive: true,
  });

  const recruiters = await User.create(
    recruitersData.map((r) => ({
      ...r,
      password: "Recruiter@123",
      role: "recruiter",
      companyLogo: "",
      bio: `Talent acquisition at ${r.companyName}`,
    }))
  );

  const jobSeekers = await User.create(
    jobSeekersData.map((s) => ({
      ...s,
      password: "Seeker@123",
      role: "job_seeker",
      bio: `Aspiring professional skilled in ${s.skills.join(", ")}`,
      resumeUrl: "https://example.com/sample-resume.pdf",
    }))
  );

  const jobs = await Job.create(
    jobTemplates.map((template, index) => {
      const recruiter = recruiters[index % recruiters.length];
      return {
        ...template,
        description: `We are looking for a talented ${template.title} to join ${recruiter.companyName}. Great opportunity to work on impactful projects.`,
        companyName: recruiter.companyName,
        companyLogo: recruiter.companyLogo,
        location: locations[index % locations.length],
        createdBy: recruiter._id,
        status: "active",
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };
    })
  );

  const applications = [];
  jobSeekers.forEach((seeker, seekerIndex) => {
    const job = jobs[seekerIndex % jobs.length];
    applications.push({
      job: job._id,
      applicant: seeker._id,
      recruiter: job.createdBy,
      resumeUrl: seeker.resumeUrl,
      coverLetter: `I'm excited to apply for the ${job.title} role — my skills in ${seeker.skills.join(", ")} align well with what you're looking for.`,
      status: "applied",
    });

    const secondJob = jobs[(seekerIndex + 3) % jobs.length];
    if (secondJob._id.toString() !== job._id.toString()) {
      applications.push({
        job: secondJob._id,
        applicant: seeker._id,
        recruiter: secondJob.createdBy,
        resumeUrl: seeker.resumeUrl,
        coverLetter: `I believe I would be a strong fit for the ${secondJob.title} position.`,
        status: "reviewing",
      });
    }
  });

  await Application.create(applications);

  console.log("Seed complete:");
  console.log(`  1 admin       -> ${admin.email} / Admin@123`);
  console.log(`  ${recruiters.length} recruiters -> Recruiter@123`);
  console.log(`  ${jobSeekers.length} job seekers -> Seeker@123`);
  console.log(`  ${jobs.length} jobs`);
  console.log(`  ${applications.length} applications`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
