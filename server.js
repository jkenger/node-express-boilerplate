const express = require("express");
const path = require("path");
const root = require("./routes/root");
const { logger } = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");

const app = express();
const PORT = process.env.PORT || 3500;

// middlewares
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// static files
app.use("/", express.static(path.join(__dirname, "/public")));

// routes
app.use("/", root);
app.all("*", (req, res) => {
  res.status(404);
  console.log(__dirname);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "/views/404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not found" });
  }
});

// error handler
app.use(errorHandler);

// listener
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
