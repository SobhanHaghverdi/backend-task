import express from "express";
import registerConfigs from "./config/index.js";
import configureMongoose from "./config/mongoose-config.js";
// import "express-async-errors";

async function buildApp() {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  registerConfigs(app);

  await configureMongoose();

  return app;
}

export default buildApp;
