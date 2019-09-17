const asyncHandler = fn => async (req, res, next) => {
  try {
    const result = await fn(req, res, next);

    // If a value is returned we'll assume that we need to render it as JSON
    if (result != undefined) {
      res.status(200).json(result);
    }
  } catch (ex) {
    console.error(ex);

    if (process.env.NODE_ENV === "development") {
      res.status(500).json({ error: ex.message });
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
};

module.exports = asyncHandler;
