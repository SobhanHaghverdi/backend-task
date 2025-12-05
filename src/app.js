import express from "express";
import registerConfigs from "./config/index.js";
// import "express-async-errors";

async function buildApp() {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  registerConfigs(app);

  return app;
}

export default buildApp;
