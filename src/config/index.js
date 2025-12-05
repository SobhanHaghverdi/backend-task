import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

//* Config files
import corsConfig from "./cors-config.js";
import helmetConfig from "./helmet-config.js";
import rateLimitConfig from "./rate-limit-config.js";
import mongoSanitizeConfig from "./mongo-sanitize-config.js";

function registerConfigs(app) {
  app.use(helmet(helmetConfig));
  app.use(cors(corsConfig));
  app.use(rateLimit(rateLimitConfig));
  app.use(mongoSanitize(mongoSanitizeConfig));
}

export default registerConfigs;
