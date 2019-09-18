const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isEmpty = require("lodash/isEmpty");
const format = require("date-fns/format");
const addMinutes = require("date-fns/addMinutes");
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: JwtStrategy } = require("passport-jwt");
const knex = require("../../connection");
const asyncHandler = require("../../helpers/asyncHandler");

const JWT_EXPIRES_IN_MIN = 10;

if (process.env.JWT_SECRET === undefined) {
  console.warn("Jwt secret has not been set!");
  process.env.JWT_SECRET = "dyKSdvTaXRS3KWbgMBDz9QlOwZZC3BlH";
}

async function getUserById(id) {
  return knex("users")
    .select()
    .where({ id })
    .first();
}

function cookieExtractor(req) {
  if (req && req.signedCookies && req.signedCookies.jwt) {
    return req.signedCookies.jwt;
  }
  return null;
}

passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET,
      // NOTE: Setting options like 'issuer' here must also be set when the token is signed below
      jsonWebTokenOptions: {
        expiresIn: JWT_EXPIRES_IN_MIN + "m", // Every 10 minutes this token will need to be refreshed
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

function generateJwtCookie(user, res) {
  const token = jwt.sign(user, process.env.JWT_SECRET);

  res.cookie("jwt", token, {
    // Options set here must also be set in the strategy
    expires: addMinutes(Date.now(), JWT_EXPIRES_IN_MIN),
    httpOnly: true,
    signed: true,
  });
}

router.post("/auth/login", passport.authenticate(["local"]), (req, res) => {
  // TODO: Add a new column to the user to track the last login date
  // Cookie must be set here so that the redirect works
  generateJwtCookie(req.user, res);
  res.redirect("/auth/session");
});

router.get("/auth/logout", (req, res) => {
  res.clearCookie("jwt");
  req.logout();
  res.redirect("/auth/session");
});

router.get("/auth/session", function(req, res, next) {
  /* look at the 2nd parameter to the below call */
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        user: false,
      });
    }

    req.logIn(user, err => {
      if (err) {
        return next(err);
      }

      // We have a valid user, generate a cookie with the jwt token
      generateJwtCookie(req.user, res);

      // Return back some of our details
      res.status(200).json({
        user: {
          id: req.user.id,
          email: req.user.email,
          created_at: req.user.created_at,
          updated_at: req.user.updated_at,
        },
      });
    });
  })(req, res, next);
});

router.post(
  "/auth/register",
  asyncHandler(async (req, res) => {
    const user = req.body;

    user.password = bcrypt.hashSync(user.password, 10);
    user.created_at = format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    user.updated_at = user.created_at;

    const [id] = await knex("users").insert(user);

    const data = await knex("users")
      .select()
      .where({ id })
      .first();

    if (isEmpty(data)) {
      res.status(500).json({ message: "An error has occurred" });
    }

    generateJwtCookie(data, res);

    res.redirect("/auth/session");
  })
);

module.exports = [passport.initialize(), router];
