const swaggerJsdoc = require("swagger-jsdoc");
const env = require("./env");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JobologyX API",
      version: "1.0.0",
      description:
        "REST API for JobologyX — a job portal backend consumed by both the React web app and the Flutter mobile app.",
    },
    servers: [{ url: `/api/v1`, description: `${env.NODE_ENV} server` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);
