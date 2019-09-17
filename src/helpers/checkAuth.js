const knex = require("../connection");

function checkAuth(req, res, next) {
  // TODO: Currently dropping token from the user, which means this whole thing needs to be revisited
  // We optionally let a bearer token be passed in, and we'll log the user in using that'
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");

    if (parts.length === 2) {
      const scheme = parts[0];
      const token = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        knex("users")
          .select()
          .where({ token })
          .then(user => {
            if (user) {
              req.login(user, () => next());
            } else {
              res.status(401).send({ message: "Unauthorized" });
            }
          });
      }
    }
  } else if (req.isAuthenticated()) {
    next();
  } else {
    res
      .status(403)
      .send({ error: "You must be logged in to access this resource." });
  }
}

module.exports = checkAuth;
