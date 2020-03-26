const express = require("express");
const router = express.Router();
const omit = require("lodash/omit");
const asyncHandler = require("../../helpers/asyncHandler");
const schemaHandler = require("../../helpers/schemaHandler");
const { convertCamelCase, convertSnakeCase } = require("../../helpers");
const schema = require("../../schema/user");
const { updateUser } = require("../../db/users");

const sanitize = (user) =>
  omit(user, ["id", "active", "verification_token", "verified"]);

router.get(
  "/user",
  asyncHandler(async (req) => {
    return convertCamelCase(sanitize(req.user));
  })
);

router.put(
  "/user",
  schemaHandler(schema, async (req, res) => {
    const user = await updateUser(req.user.id, convertSnakeCase(req.body));

    res.status(200).json(convertCamelCase(sanitize(user)));
  })
);

router.delete(
  "/user",
  asyncHandler(async (req, res) => {
    // TODO: Add a deleteUser method
    res.status(200).json({ success: true });
  })
);

module.exports = router;
