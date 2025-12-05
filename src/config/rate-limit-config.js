const allowlist = ["127.0.0.1"];

const rateLimitConfig = {
  limit: 100,
  legacyHeaders: true,
  standardHeaders: "draft-8",
  skip: (req, res) => allowlist.includes(req.ip),
  message: "Too many requests from this IP, please try again after a minute",
};

export default rateLimitConfig;
