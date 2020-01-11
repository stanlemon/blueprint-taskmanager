import React from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";
import { Field } from "./elements/";

export function UserForm({
  name,
  email,
  password,
  repeat_password,
  errors = {},
  setValue,
}) {
  return (
    <>
      <Field
        name="name"
        label="Name"
        error={errors.name}
        value={name}
        onChange={setValue}
      />
      <Field
        name="email"
        label="Email"
        type="email"
        error={errors.email}
        value={email}
        onChange={setValue}
      />
      <Field
        name="password"
        label="Password"
        type="password"
        error={errors.password}
        value={password}
        onChange={setValue}
      />
      <Field
        name="repeat_password"
        label="Repeat Password"
        type="password"
        error={errors.repeat_password}
        value={repeat_password}
        onChange={setValue}
      />
    </>
  );
}

export const UserPropTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  password: PropTypes.string,
  repeat_password: PropTypes.string,
};

UserForm.propTypes = {
  ...UserPropTypes,
  errors: PropTypes.shape(UserPropTypes),
  setValue: PropTypes.func,
};

export default UserForm;

export function validate(
  { name, email, password, repeat_password } = {
    name: "",
    email: "",
    password: "",
    repeat_password: "",
  },
  { requirePassword } = { requirePassword: true }
) {
  const errors = {};

  if (isEmpty(name)) {
    errors["name"] = "You must enter your name.";
  }

  if (isEmpty(email)) {
    errors["email"] = "You must enter your email.";
  }

  if (!isEmpty(email) && !isEmail(email)) {
    errors["email"] = "You must enter a valid email address.";
  }

  if (requirePassword && isEmpty(password)) {
    errors["password"] = "You must enter your password.";
  }

  // Ensure that they've entered their password twice
  if (!isEmpty(password) && password != repeat_password) {
    errors["repeat_password"] = "Your password does not match.";
  }

  if (!isEmpty(password) && !isLength(password, { min: 8, max: 64 })) {
    errors["password"] =
      "Your password must be between 8 and 64 characters in length.";
  }

  return errors;
}
