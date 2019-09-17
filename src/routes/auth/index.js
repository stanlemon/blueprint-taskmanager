const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isEmpty = require("lodash/isEmpty");
const format = require("date-fns/format");
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const knex = require("../../connection");
const asyncHandler = require("../../helpers/asyncHandler");
const { convertCamelCase, convertSnakeCase } = require("../../helpers");

if (process.env.JWT_SECRET === undefined) {
  console.warn("JWT secret has not been set, defaulting to insecure one");
  process.env.JWT_SECRET = "dyKSdvTaXRS3KWbgMBDz9QlOwZZC3BlH";
}

async function getUserById(id) {
  return knex("users")
    .select()
    .where({ id })
    .first();
}

passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      issuer: "blueprint",
      jsonWebTokenOptions: {
        expiresIn: "10m", // Every 10 minutes this token will need to be refreshed
      },
    },
    (payload, done) => {
      getUserById(payload.id)
        .then(user => done(null, user))
        .catch(ex => done(ex));
    }
  )
);

passport.use(
  "local",
  new LocalStrategy((username, password, done) => {
    knex("users")
      .select()
      .where({ email: username, active: true })
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
  getUserById(id)
    .then(user => {
      // An undefined user means we couldn't find it, so the session is invalid
      done(null, user === undefined ? false : user);
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
    const token = jwt.sign(req.user, process.env.JWT_SECRET);

    res.status(200).json({
      user: {
        id: req.user.id,
        createdAt: req.user.createdAt,
      },
      token,
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
        res
          .status(500)
          .json({ error: "An error has occurred while registering." });
      }

      res.status(200).json(convertCamelCase(data));
    });
  })
);

module.exports = [
  passport.initialize(),
  // Default strategy for now is both jwt & session, note I think that passing jwt this way will enable a session
  passport.authenticate(["jwt", "session"]),
  router,
];
