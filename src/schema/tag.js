const Joi = require("@hapi/joi");

const schema = Joi.object().keys({
  id: Joi.number().allow(null).optional().label("Tag id"),
  name: Joi.string().required().label("Tag name"),
});

module.exports = schema;
