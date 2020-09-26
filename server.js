const path = require("path");
const http = require("http");
const killable = require("killable");
const serveStatic = require("serve-static");
const passport = require("passport");

require("dotenv").config();

// Require at this point because our env variables should be defaulted
const app = require("./src/app");
const knex = require("./src/connection");

// Routes for login, logout, session status + passport setup
app.use(require("./src/routes/auth"));

app.use("/api", [
  passport.authenticate("jwt", { session: false }),
  // Secure authentication to the API
  require("./src/helpers/checkAuth"),
  // API routes
  require("./src/routes/api"),
]);

// Serve compiled assets
app.use(serveStatic(path.join(__dirname, "dist")));

// All other requests get routed to our SPA
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Ensure the database is up to date
knex.migrate.latest();

const server = http.createServer(app);

/*eslint no-console: "off"*/
server.listen(process.env.PORT, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  const host =
    server.address().address === "::" ? "localhost" : server.address().address;
  const port = server.address().port;

  console.log("Starting in %s mode", process.env.NODE_ENV);
  console.log("Listening at http://%s:%s", host, port);
});

killable(server);

module.exports = { server };
