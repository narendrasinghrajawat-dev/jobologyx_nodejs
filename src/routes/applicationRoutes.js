const express = require("express");
const applicationController = require("../controllers/applicationController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { applyValidator, updateStatusValidator } = require("../validators/applicationValidator");
const validate = require("../validators/validate");

const router = express.Router();

router.use(protect);

/**
 * @openapi
 * /applications:
 *   post:
 *     tags: [Applications]
 *     summary: Apply for a job (job seeker only)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jobId]
 *             properties:
 *               jobId: { type: string }
 *               coverLetter: { type: string }
 *     responses:
 *       201:
 *         description: Application submitted
 *       409:
 *         description: Already applied to this job
 */
router.post("/", authorizeRoles("job_seeker"), applyValidator, validate, applicationController.applyToJob);

/**
 * @openapi
 * /applications/my:
 *   get:
 *     tags: [Applications]
 *     summary: My applications (job seeker only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Paginated list of my applications
 */
router.get("/my", authorizeRoles("job_seeker"), applicationController.getMyApplications);

/**
 * @openapi
 * /applications/recruiter:
 *   get:
 *     tags: [Applications]
 *     summary: Applications for my jobs (recruiter only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: job
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Paginated list of applications for the recruiter's jobs
 */
router.get("/recruiter", authorizeRoles("recruiter"), applicationController.getRecruiterApplications);

/**
 * @openapi
 * /applications/{id}:
 *   get:
 *     tags: [Applications]
 *     summary: Get an application by id (owner applicant, owning recruiter, or admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Application details
 *       403:
 *         description: Not permitted to view this application
 */
router.get("/:id", applicationController.getApplicationById);

/**
 * @openapi
 * /applications/{id}/status:
 *   patch:
 *     tags: [Applications]
 *     summary: Update application status (owning recruiter only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [applied, reviewing, shortlisted, rejected, hired] }
 *     responses:
 *       200:
 *         description: Application status updated
 */
router.patch(
  "/:id/status",
  authorizeRoles("recruiter"),
  updateStatusValidator,
  validate,
  applicationController.updateApplicationStatus
);

module.exports = router;
