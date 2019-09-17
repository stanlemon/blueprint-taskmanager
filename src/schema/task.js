const Joi = require("@hapi/joi");

const schema = Joi.object().keys({
  name: Joi.string()
    .required()
    .label("Task name"),
  description: Joi.string()
    .allow(null, "")
    .optional()
    .label("Task description"),
  completed: Joi.date()
    .allow(null)
    .optional()
    .label("Task completion date"),
  due: Joi.date()
    .allow(null)
    .optional()
    .label("Task due date"),
});

module.exports = schema;
