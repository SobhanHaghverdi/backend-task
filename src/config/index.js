import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

//* Config files
import env from "./env-config.js";
import corsConfig from "./cors-config.js";
import helmetConfig from "./helmet-config.js";
import swaggerConfig from "./swagger-config.js";
import rateLimitConfig from "./rate-limit-config.js";
import NodeEnv from "../common/constant/node-env-enum.js";

function registerConfigs(app) {
  app.use(helmet(helmetConfig));
  app.use(cors(corsConfig));
  app.use(rateLimit(rateLimitConfig));

  if (env.NODE_ENV === NodeEnv.DEVELOPMENT) {
    const swagger = swaggerUi.setup(swaggerConfig, {
      customSiteTitle: "Behtech Backend Task Swagger UI",
    });

    app.use("/docs", swaggerUi.serve, swagger);

    app.get("/docs.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerConfig);
    });
  }
}

export default registerConfigs;
