const path = require("path");
const http = require("http");
const killable = require("killable");
const express = require("express");
const helmet = require("helmet");
const serveStatic = require("serve-static");
const bodyParser = require("body-parser");
const compression = require("compression");
const morgan = require("morgan");
const session = require("client-sessions");

const DEV = "development";
const ENV = process.env.NODE_ENV || DEV;
const PORT = process.env.PORT || 3000;

const logger = morgan("combined");
const app = express();

app.use(logger);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    cookieName: "blueprint", // cookie name dictates the key name added to the request object
    requestKey: "session",
    secret: "theredballonfloatssouthintheslowwindsofazkaban", // should be a large unguessable string
    duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
    activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, session is extended by activeDuration
  })
);

// Routes for login, logout, session status
app.use(require("./src/routes/auth"));

app.use("/api", [
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
  app.use(helmet());

  // Serve assets compiled by parcel
  app.use(serveStatic(path.join(__dirname, "dist")));

  // All other requests get routed to our SPA
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

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
