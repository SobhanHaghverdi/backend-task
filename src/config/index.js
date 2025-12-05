import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

//* Config files
import corsConfig from "./cors-config.js";
import helmetConfig from "./helmet-config.js";
import rateLimitConfig from "./rate-limit-config.js";

function registerConfigs(app) {
  app.use(helmet(helmetConfig));
  app.use(cors(corsConfig));
  app.use(rateLimit(rateLimitConfig));
}

export default registerConfigs;
