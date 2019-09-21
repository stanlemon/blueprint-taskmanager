const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { getTags } = require("../../db/tags");

router.get(
  "/tags",
  asyncHandler(async req => {
    const tags = await getTags(req.user.id);
    return tags;
  })
);

module.exports = router;
