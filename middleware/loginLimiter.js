const rateLimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message:
    "Too many login attempts from this IP, please try again after 1 minute",
  handler: (req, res, next) => {
    logEvents.emit("warn", {
      message: "Too many login attempts from this IP",
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    next();
  },
});
