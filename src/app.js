const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const session = require("express-session");

require("dotenv").config();

const app = express();

const logger = morgan("combined");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(logger);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(compression());
  app.use(helmet());
}

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Taken from https://github.com/jaredhanson/passport/issues/904#issuecomment-1307558283
app.use((request, response, next) => {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb) => {
      cb();
    };
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb) => {
      cb();
    };
  }
  next();
});

module.exports = app;
