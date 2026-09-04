const express = require("express");
const authController = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const { registerValidator, loginValidator } = require("../validators/authValidator");
const validate = require("../validators/validate");
const { authLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new job seeker or recruiter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "Jane Doe" }
 *               email: { type: string, example: "jane@example.com" }
 *               password: { type: string, example: "password123" }
 *               role: { type: string, enum: [job_seeker, recruiter], example: "job_seeker" }
 *               phone: { type: string, example: "9999999999" }
 *     responses:
 *       201:
 *         description: Registration successful
 *       409:
 *         description: Email already in use
 */
router.post("/register", authLimiter, registerValidator, validate, authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "jane@example.com" }
 *               password: { type: string, example: "password123" }
 *     responses:
 *       200:
 *         description: Login successful, returns user and JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", authLimiter, loginValidator, validate, authController.login);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get the currently authenticated user
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Current user
 *       401:
 *         description: Not authorized
 */
router.get("/me", protect, authController.getMe);

module.exports = router;
