const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();

const logger = morgan("combined");

app.use(logger);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(compression());
  app.use(helmet());
}

module.exports = app;
