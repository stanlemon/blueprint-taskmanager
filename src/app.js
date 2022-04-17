const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const app = express();

const logger = morgan("combined");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

//app.use(limiter);
app.use(logger);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(compression());
  app.use(helmet());
}

module.exports = app;
