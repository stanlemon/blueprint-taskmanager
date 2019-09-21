const asyncHandler = require("./asyncHandler");

const schemaHandler = (schema, fn) => async (req, res, next) => {
  // Validate the input schema
  const { value, error } = await schema.validate(req.body, {
    // False here will not allow keys that are not part of the schema
    allowUnknown: false,
    // True here will strip the unknown keys from the returned value
    stripUnknown: true,
    // Ensure that all rules are evaluated, by default Joi stops on the first error
    abortEarly: false,
    // Customized error messages
    messages: {
      "any.required": "{{#label}} is required",
      "string.empty": "{{#label}} is not allowed to be empty",
      "string.email": "{{#label}} must be a valid email address",
      "string.min": "{{#label}} must be at least {{#limit}} characters long",
      "string.max": "{{#label}} cannot be more than {{#limit}} characters long",
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

  // eslint-disable-next-line require-atomic-updates
  req.body = value;

  // Wrap all of these in our async handler
  await asyncHandler(fn)(req, res, next);
};

module.exports = schemaHandler;
