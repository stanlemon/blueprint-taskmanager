const path = require("path");
const http = require("http");
const killable = require("killable");
const express = require("express");
const helmet = require("helmet");
const serveStatic = require("serve-static");
const bodyParser = require("body-parser");
const compression = require("compression");
const morgan = require("morgan");
const passport = require("passport");
const cookieParser = require("cookie-parser");

const DEV = "development";

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = DEV;
}

// Require it at this point to ensure we have a node env specified
const knex = require("./src/connection");

if (!process.env.COOKIE_SECRET) {
  console.warn("Cookie secret has not been set!");
  process.env.COOKIE_SECRET = "process.env.COOKIE_SECRET";
}

const ENV = process.env.NODE_ENV;

const PORT = process.env.PORT || 3000;

const logger = morgan("combined");
const app = express();

app.use(logger);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());

// Routes for login, logout, session status + passport setup
app.use(require("./src/routes/auth"));

app.use("/api", [
  passport.authenticate("jwt", { session: false }),
  // Secure authentication to the API
  require("./src/helpers/checkAuth"),
  // API routes
  require("./src/routes/api"),
]);

if (ENV === DEV) {
  /* eslint-disable-line global-require, import/no-extraneous-dependencies */
  const Bundler = require("parcel-bundler");

  const file = path.join(__dirname, "web", "index.html");

  const options = {
    //cache: false,
    hmr: true,
    production: false,
  };

  // Initialize a new parcel bundler
  const bundler = new Bundler(file, options);

  // This will let Parcel handle every request to the express server not already defined
  app.use(bundler.middleware());
  /* eslint-enable */
} else {
  app.use(compression());
  app.use(helmet());

  // Serve assets compiled by parcel
  app.use(serveStatic(path.join(__dirname, "dist")));

  // All other requests get routed to our SPA
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

// Ensure the database is up to date
knex.migrate.latest();

const server = http.createServer(app);

/*eslint no-console: "off"*/
server.listen(PORT, err => {
  if (err) {
    console.error(err);
    return;
  }

  const host =
    server.address().address === "::" ? "localhost" : server.address().address;
  const port = server.address().port;

  console.log("Starting in %s mode", ENV);
  console.log("Listening at http://%s:%s", host, port);
});

killable(server);

module.exports = { server };
