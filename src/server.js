const env = require("./config/env");
const connectDB = require("./config/db");
const app = require("./app");

const startServer = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`JobologyX API running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    console.log(`Swagger docs available at http://localhost:${env.PORT}/api/v1/docs`);
  });

  process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

startServer();
