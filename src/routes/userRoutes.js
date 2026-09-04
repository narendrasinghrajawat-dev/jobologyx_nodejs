const express = require("express");
const userController = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const { uploadImage, uploadResume } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(protect);

/**
 * @openapi
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get my profile
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Profile fetched
 *   patch:
 *     tags: [Users]
 *     summary: Update my profile
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               phone: { type: string }
 *               bio: { type: string }
 *               skills: { type: array, items: { type: string } }
 *               location: { type: string }
 *               companyName: { type: string }
 *               companyWebsite: { type: string }
 *               companyLogo: { type: string }
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.get("/me", userController.getMe);
router.patch("/me", userController.updateMe);

/**
 * @openapi
 * /users/me/profile-image:
 *   post:
 *     tags: [Users]
 *     summary: Upload/replace my profile image (all roles)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Profile image uploaded
 */
router.post("/me/profile-image", uploadImage.single("image"), userController.uploadProfileImage);

/**
 * @openapi
 * /users/me/resume:
 *   post:
 *     tags: [Users]
 *     summary: Upload/replace my resume (job seekers only)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Resume uploaded
 *       403:
 *         description: Only job seekers can upload a resume
 */
router.post("/me/resume", uploadResume.single("resume"), userController.uploadResume);

/**
 * @openapi
 * /users/me/company-logo:
 *   post:
 *     tags: [Users]
 *     summary: Upload/replace my company logo (recruiters only)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Company logo uploaded
 *       403:
 *         description: Only recruiters can upload a company logo
 */
router.post("/me/company-logo", uploadImage.single("logo"), userController.uploadCompanyLogo);

module.exports = router;
