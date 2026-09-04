const express = require("express");
const jobController = require("../controllers/jobController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { createJobValidator, updateJobValidator } = require("../validators/jobValidator");
const validate = require("../validators/validate");

const router = express.Router();

/**
 * @openapi
 * /jobs:
 *   get:
 *     tags: [Jobs]
 *     summary: List/search jobs (public)
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Full-text search across title, description, companyName, skills, location
 *       - in: query
 *         name: location
 *         schema: { type: string }
 *       - in: query
 *         name: jobType
 *         schema: { type: string, enum: [full_time, part_time, contract, internship, freelance] }
 *       - in: query
 *         name: workMode
 *         schema: { type: string, enum: [onsite, remote, hybrid] }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: experience
 *         schema: { type: string }
 *       - in: query
 *         name: salaryMin
 *         schema: { type: number }
 *       - in: query
 *         name: salaryMax
 *         schema: { type: number }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [active, closed, draft] }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [latest, oldest, salaryHigh, salaryLow] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Paginated list of jobs
 *   post:
 *     tags: [Jobs]
 *     summary: Create a job (recruiter only)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, location, jobType, workMode]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               location: { type: string }
 *               jobType: { type: string, enum: [full_time, part_time, contract, internship, freelance] }
 *               workMode: { type: string, enum: [onsite, remote, hybrid] }
 *               salaryMin: { type: number }
 *               salaryMax: { type: number }
 *               experience: { type: string }
 *               skills: { type: array, items: { type: string } }
 *               category: { type: string }
 *               status: { type: string, enum: [active, closed, draft] }
 *               applicationDeadline: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Job created
 */
router
  .route("/")
  .get(jobController.listJobs)
  .post(protect, authorizeRoles("recruiter"), createJobValidator, validate, jobController.createJob);

/**
 * @openapi
 * /jobs/{id}:
 *   get:
 *     tags: [Jobs]
 *     summary: Get a job by id (public)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 *   patch:
 *     tags: [Jobs]
 *     summary: Update a job (recruiter, own job only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Job updated
 *       403:
 *         description: Not the owning recruiter
 *   delete:
 *     tags: [Jobs]
 *     summary: Delete a job (recruiter, own job only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Job deleted
 *       403:
 *         description: Not the owning recruiter
 */
router
  .route("/:id")
  .get(jobController.getJobById)
  .patch(protect, authorizeRoles("recruiter"), updateJobValidator, validate, jobController.updateJob)
  .delete(protect, authorizeRoles("recruiter"), jobController.deleteJob);

module.exports = router;
