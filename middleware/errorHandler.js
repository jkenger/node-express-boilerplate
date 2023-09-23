// Type: CJS

// const { logEvents } = require("./logger");

// const errorHandler = (err, req, res, next) => {
//   logEvents(
//     `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
//     "error.log"
//   );
//   const status = res.statusCode ? res.statusCode : 500;

//   res.status(status);

//   res.json({
//     message: err.message,
//     stack: process.env.NODE_ENV === "production" ? null : err.stack,
//   });
// };

// module.exports = { errorHandler };


// Type: Module
import { StatusCodes } from "http-status-codes";

const errorHandler = (err, req, res, next) => {
  console.log(err);
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const msg = err.message || "Something went wrong, please try again later";
  res.status(statusCode).json({ msg });
};

export default errorHandler;
