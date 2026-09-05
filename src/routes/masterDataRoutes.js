const express = require("express");
const masterDataController = require("../controllers/masterDataController");

const router = express.Router();

/**
 * @openapi
 * /master-data:
 *   get:
 *     tags: [MasterData]
 *     summary: Get all reference/lookup data, grouped by type (public)
 *     description: >
 *       For populating frontend form dropdowns in one call. Returns an object keyed by
 *       roles, jobTypes, workModes, jobStatuses, applicationStatuses, categories, experienceLevels
 *       — each an array of { code, name, label }. `name` matches the string enum value the
 *       API actually validates against (e.g. "recruiter", "full_time"); `label` is for display.
 *     responses:
 *       200:
 *         description: Master data grouped by type
 */
router.get("/", masterDataController.getAll);

/**
 * @openapi
 * /master-data/{type}:
 *   get:
 *     tags: [MasterData]
 *     summary: Get one master data type (public)
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema: { type: string, enum: [role, jobType, workMode, jobStatus, applicationStatus, category, experienceLevel] }
 *     responses:
 *       200:
 *         description: Array of { code, name, label } for that type
 *       404:
 *         description: Unknown type
 */
router.get("/:type", masterDataController.getByType);

module.exports = router;
