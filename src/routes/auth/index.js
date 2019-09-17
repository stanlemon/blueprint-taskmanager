const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const isEmpty = require("lodash/isEmpty");
const format = require("date-fns/format");
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const knex = require("../../connection");
const asyncHandler = require("../../helpers/asyncHandler");
const { convertCamelCase, convertSnakeCase } = require("../../helpers");

passport.use(
  new LocalStrategy((username, password, done) => {
    knex("users")
      .select()
      .where({ email: username })
      .first()
      .then(user => {
        if (!user) {
          return done(null, false, {
            message: "Incorrect email or password.",
          });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, {
            message: "Incorrect email or password.",
          });
        }
        return done(null, user);
      })
      .catch(error => done(error, null));
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  knex("users")
    .select()
    .where({ id })
    .first()
    .then(user => {
      done(null, user);
    })
    .catch(error => {
      done(error, null);
    });
});

router.post("/auth/login", passport.authenticate("local"), (req, res) => {
  res.redirect("/auth/session");
});

router.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/session");
});

router.get("/auth/session", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      user: {
        id: req.user.id,
        createdAt: req.user.createdAt,
      },
    });
  } else {
    res.status(401).json({
      user: false,
    });
  }
});

router.post(
  "/auth/register",
  asyncHandler(async (req, res) => {
    const user = req.body;

    user.password = bcrypt.hashSync(user.password, 10);
    user.createdAt = format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    user.updatedAt = user.createdAt;

    const [id] = await knex("users").insert(convertSnakeCase(user));

    const data = await knex("users")
      .select()
      .where({ id })
      .first();

    if (isEmpty(data)) {
      res.status(500).json({ message: "An error has occurred" });
    }

    req.login(data, err => {
      if (err) {
        // TODO: Render errors to the API output
        console.error(err);
      }

      res.status(200).json(convertCamelCase(data));
    });
  })
);

module.exports = [passport.initialize(), passport.session(), router];
