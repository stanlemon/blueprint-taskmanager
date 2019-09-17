//const knex = require("../connection");

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res
      .status(403)
      .send({ error: "You must be logged in to access this resource." });
  }
}

module.exports = checkAuth;
