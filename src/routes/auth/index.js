const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const isEmpty = require("lodash/isEmpty");
const { addMinutes } = require("date-fns");
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: JwtStrategy } = require("passport-jwt");
const sendgrid = require("@sendgrid/mail");
const { makeDateString } = require("../../utils");
const schemaHandler = require("../../helpers/schemaHandler");
const schema = require("../../schema/user");
const {
  getUserById,
  getUserByEmailAndPassword,
  getUserByVerificationToken,
  createUser,
  updateUser,
} = require("../../db/users");

require("dotenv").config();

const JWT_EXPIRES_IN_MIN = 120;

if (process.env.JWT_SECRET === undefined) {
  // eslint-disable-next-line no-console
  console.warn("Jwt secret has not been set!");
  process.env.JWT_SECRET = "dyKSdvTaXRS3KWbgMBDz9QlOwZZC3BlH";
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
        .then((user) => done(null, user))
        .catch((ex) => done(ex));
    }
  )
);

passport.use(
  "local",
  new LocalStrategy((username, password, done) => {
    getUserByEmailAndPassword(username, password)
      .then((user) => {
        if (!user) {
          return done(null, false, {
            message: "Incorrect email or password.",
          });
        }

        return done(null, user);
      })
      .catch((error) => done(error, null));
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  getUserById(id)
    .then((user) => {
      // An undefined user means we couldn't find it, so the session is invalid
      done(null, user === undefined ? false : user);
    })
    .catch((error) => {
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

router.post(
  "/auth/login",
  passport.authenticate(["local"]),
  async (req, res) => {
    await updateUser(req.user.id, {
      last_logged_in: makeDateString(),
    });

    // Cookie must be set here so that the redirect works
    generateJwtCookie(req.user, res);

    res.redirect("/auth/session");
  }
);

router.get("/auth/logout", (req, res) => {
  res.clearCookie("jwt");
  req.logout();
  res.redirect("/auth/session");
});

router.get("/auth/session", function (req, res, next) {
  /* look at the 2nd parameter to the below call */
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        user: false,
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      // We have a valid user, generate a cookie with the jwt token
      generateJwtCookie(req.user, res);

      // Return back some of our details
      res.status(200).json({ user: req.user });
    });
  })(req, res, next);
});

router.post(
  "/auth/register",
  schemaHandler(
    // Modify the schema to make password required for this operation
    schema.append({ password: schema._keys.password.required() }),
    async (req, res) => {
      const user = await createUser(req.body);

      if (isEmpty(user)) {
        res.status(500).json({
          message: "An error has occurred",
        });
      }

      const url = process.env.BASE_URL + "/verify/" + user.verification_token;

      const message = {
        to: user.email,
        from: process.env.EMAIL_FROM,
        subject: "Blueprint: Verify your Email Address",
        text: `Click on the following link to verify your email address: ${url}`,
        html: `<p>Click on the following link to verify your email address:<br /><a href="${url}">${url}</a></p>`,
      };

      if (process.env.SENDGRID_API_KEY) {
        // eslint-disable-next-line no-console
        console.log("Sending email to SendGrid");

        sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
        sendgrid.send(message).catch((err) => {
          // eslint-disable-next-line no-console
          console.error(err.toString());
        });
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          "SendGrid API key is not set, not sending verification email"
        );
      }

      generateJwtCookie(user, res);

      res.redirect("/auth/session");
    }
  )
);

router.get("/auth/verify/:token", async (req, res) => {
  const { token } = req.params;

  const user = await getUserByVerificationToken(token);

  if (isEmpty(user)) {
    return res
      .status(401)
      .json({ success: false, message: "Cannot verify email address. 😥" });
  }

  if (!isEmpty(user.verified)) {
    return res
      .status(200)
      .send({ success: false, message: "Email address already verified. 🤔" });
  }

  await updateUser(user.id, { verified: makeDateString() });

  return res.send({ success: true, message: "Email address verified! 👍" });
});

module.exports = [passport.initialize(), router];
