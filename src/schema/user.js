const Joi = require("@hapi/joi");

const schema = Joi.object().keys({
  name: Joi.string()
    .required()
    .label("Name"),
  email: Joi.string()
    .email()
    .required()
    .label("Email address"),
  password: Joi.string()
    .min(8)
    .max(64)
    .required()
    .label("Password"),
});

module.exports = schema;
