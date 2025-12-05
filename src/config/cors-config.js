import env from "./env-config.js";

const corsConfig = {
  credentials: true,
  origin: env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

export default corsConfig;
