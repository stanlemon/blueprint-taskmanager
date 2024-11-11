const InvalidArgument = require("../db/invalidargument");

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    const result = await fn(req, res, next);

    // If a value is returned we'll assume that we need to render it as JSON
    if (result !== undefined) {
      res.status(200).json(result);
    }
  } catch (ex) {
    // An upstream validation error
    if (ex instanceof InvalidArgument) {
      res.status(400).json({ errors: { [ex.key]: ex.message } });
      return;
    }

    if (
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "test"
    ) {
      console.error(ex);

      res.status(500).json({ error: ex.message });
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
};

module.exports = asyncHandler;
