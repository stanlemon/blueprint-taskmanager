const Joi = require("@hapi/joi");

const schema = Joi.object().keys({
  id: Joi.number()
    .allow(null)
    .optional()
    .label("Tag id"),
  name: Joi.string()
    .required()
    .label("Tag name"),
  description: Joi.string()
    .allow(null, "")
    .optional()
    .label("Task description"),
});

module.exports = schema;
