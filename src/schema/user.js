const Joi = require("joi");

const keys = {
  name: Joi.string().required().label("Name"),
  email: Joi.string().email().required().label("Email address"),
  password: Joi.string()
    .allow("")
    .min(8)
    .max(64)
    //.required() This is only required on the register screen where we handle it manually
    .label("Password"),
};

const schema = Joi.object().keys(keys);
// We append the original keys here so that they can be modified for the register end point, which
// will mark the password as required.
schema._keys = keys;

module.exports = schema;
