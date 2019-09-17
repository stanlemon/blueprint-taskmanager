const asyncHandler = require("./asyncHandler");

const schemaHandler = (schema, fn) => async (req, res, next) => {
  // Validate the input schema
  const { error } = await schema.validate(req.body, {
    // TODO: Remove this
    allowUnknown: true,
    // Ensure that all rules are evaluated, by default Joi stops on the first error
    abortEarly: false,
    // Customized error messages
    messages: {
      "any.required": "{{#label}} is required",
      "date.base": "{{#label}} must be a valid date",
    },
  });

  if (error) {
    res.status(400).json({
      errors: Object.assign.apply(
        null,
        error.details.map(d => ({ [d.path]: d.message }))
      ),
    });
    return;
  }

  // Wrap all of these in our async handler
  await asyncHandler(fn)(req, res, next);
};

module.exports = schemaHandler;
