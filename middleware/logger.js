const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;

const path = require("path");

const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  const logMessage = `${dateTime}\t ${uuid()} - ${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "../logs"))) {
      fs.mkdirSync(path.join(__dirname, "../logs"));
    }

    await fsPromises.appendFile(
      path.join(__dirname, `../logs/${logFileName}`),
      logMessage
    );
  } catch (e) {
    console.log(e);
  }
};

const logger = (req, res, next) => {
  const { method, url } = req;
  const message = `${method}\t ${url}\t${req.headers.origin}`;
  logEvents(message, "access.log");
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logger, logEvents };
