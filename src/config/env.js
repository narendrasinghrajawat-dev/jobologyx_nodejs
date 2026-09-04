const path = require("path");

const NODE_ENV = process.env.NODE_ENV || "development";
const envFileName = NODE_ENV === "production" ? ".env.production" : ".env.test";

require("dotenv").config({ path: path.resolve(__dirname, "../../env", envFileName) });

const env = {
  NODE_ENV,
  PORT: process.env.PORT || 5000,

  MONGODB_URI: process.env.MONGODB_URI,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  WEB_CLIENT_URL: process.env.WEB_CLIENT_URL || "",
};

const requiredInProduction = ["MONGODB_URI", "JWT_SECRET"];

if (env.NODE_ENV === "production") {
  const missing = requiredInProduction.filter((key) => !env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

module.exports = env;
