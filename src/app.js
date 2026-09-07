const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const env = require("./config/env");
const swaggerSpec = require("./config/swagger");
const { apiLimiter } = require("./middleware/rateLimitMiddleware");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const masterDataRoutes = require("./routes/masterDataRoutes");

const app = express();

app.use(helmet());

// Allowed origins for React web, Flutter web (GitHub Pages, Vercel, localhost), and mobile apps.
const allowedOrigins = env.WEB_CLIENT_URL.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Flutter mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      // Allow if explicitly configured in WEB_CLIENT_URL or standard web deployments
      if (
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".github.io") ||
        origin.endsWith(".vercel.app") ||
        origin.startsWith("http://localhost:")
      ) {
        return callback(null, true);
      }
      callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({ success: true, message: "JobologyX API is running", data: null });
});

app.use("/api/v1", apiLimiter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/master-data", masterDataRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
