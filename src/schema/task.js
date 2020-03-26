const Joi = require("@hapi/joi");

const schema = Joi.object().keys({
  id: Joi.number().allow(null).optional().label("Task id"),
  name: Joi.string().required().label("Task name"),
  description: Joi.string()
    .allow(null, "")
    .optional()
    .label("Task description"),
  completed: Joi.date().allow(null).optional().label("Task completion date"),
  due: Joi.date().allow(null).optional().label("Task due date"),
  tags: Joi.array().optional().items(Joi.string()),
});

module.exports = schema;
