import express from "express";
import registerConfigs from "./config/index.js";
import registerRoutes from "./modules/index.js";
import configureMongoose from "./config/mongoose-config.js";
import globalErrorHandler from "./common/middlewares/global-error-handler.js";
import notFoundErrorHandler from "./common/middlewares/not-found-error-handler.js";

async function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  registerConfigs(app);
  app.use("/api", registerRoutes());

  await configureMongoose();

  //* Error handlers
  app.use(notFoundErrorHandler);
  app.use(globalErrorHandler);

  return app;
}

export default buildApp;
