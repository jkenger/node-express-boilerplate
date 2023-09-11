const rateLimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    message:
      "Too many login attempts from this IP, please try again after 1 minute",
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Too Many Login Attempts: ${options.message.message}
    t${req.method}\t${req.url}\t${req.url}\t${req.headers.origin}`,
      "errLog.log"
    );
    res.status(options.statusCode).json(options.message);
    next();
  },
  standardHeaders: true, // adds e.g. Retry-After
  legacyHeaders: false, // disables e.g. X-RateLimit-Limit
});

module.exports = loginLimiter;
