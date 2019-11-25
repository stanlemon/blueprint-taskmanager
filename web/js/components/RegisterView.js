import isEmpty from "lodash/isEmpty";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { navigateTo } from "../lib/Navigation";
import { registerUser } from "../actions/";
import { Container, Columns, Column, Field, Button } from "./elements/";

export class RegisterView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        name: "",
        email: "",
        password: "",
      },
    };
  }

  handleClickToLogin = () => {
    navigateTo("/login");
  };

  handleSubmit = e => {
    e.preventDefault();

    const errors = {};

    if (isEmpty(this.state.data) || isEmpty(this.state.data.name)) {
      errors["name"] = "You must enter your name.";
    }

    if (isEmpty(this.state.data) || isEmpty(this.state.data.email)) {
      errors["email"] = "You must enter your email.";
    }

    if (!isEmpty(this.state.data.email) && !isEmail(this.state.data.email)) {
      errors["email"] = "You must enter a valid email address.";
    }

    if (isEmpty(this.state.data) || isEmpty(this.state.data.password)) {
      errors["password"] = "You must enter your password.";
    }

    // Ensure that they've entered their password twice
    if (
      !isEmpty(this.state.data.password) &&
      this.state.data.password != this.state.data.repeat_password
    ) {
      errors["repeat_password"] = "Your password does not match.";
    }

    if (
      !isEmpty(this.state.data.password) &&
      !isLength(this.state.data.password, { min: 8, max: 64 })
    ) {
      errors["password"] =
        "Your password must be between 8 and 64 characters in length.";
    }

    // If there are any errors, bail
    if (Object.keys(errors).length > 0) {
      this.setState(state => {
        return { ...state, ...{ errors } };
      });
      return;
    }

    // Clear out our errors
    this.setState(state => {
      return { ...state, errors: {} };
    });

    this.props.registerUser(this.state.data);
  };

  setValue = e => {
    const key = e.target.name;
    const value = e.target.value;

    this.setState(state => {
      return {
        ...state,
        ...{
          data: {
            ...state.data,
            ...{ [key]: value },
          },
        },
      };
    });
  };

  render() {
    const errors = { ...this.props.errors, ...this.state.errors };

    return (
      <Container
        style={{
          maxWidth: 500,
          paddingLeft: ".5rem",
          paddingRight: ".5rem",
          marginTop: "-2.5rem",
          marginBottom: "1rem",
        }}
      >
        <h1 className="title">Register an Account</h1>
        <form id="register-form" onSubmit={this.handleSubmit}>
          <div className="well">
            <Field
              name="name"
              label="Name"
              error={errors.name}
              value={this.state.data.name}
              onChange={this.setValue}
            />
            <Field
              name="email"
              label="Email"
              type="email"
              error={errors.email}
              value={this.state.data.email}
              onChange={this.setValue}
            />
            <Field
              name="password"
              label="Password"
              type="password"
              error={errors.password}
              value={this.state.data.password}
              onChange={this.setValue}
            />
            <Field
              name="repeat_password"
              label="Password"
              type="password"
              error={errors.repeat_password}
              value={this.state.data.repeat_password}
              onChange={this.setValue}
            />
            <Columns gutters={false}>
              <Column offset={3} size={6}>
                <Button
                  id="register-button"
                  type="submit"
                  onClick={this.handleSubmit}
                  is="primary"
                >
                  Register
                </Button>
              </Column>
            </Columns>
          </div>
        </form>
        <div className="has-text-centered" style={{ marginTop: "2.5rem" }}>
          <a is="link" onClick={this.handleClickToLogin}>
            Return to Login
          </a>
        </div>
      </Container>
    );
  }
}

RegisterView.propTypes = {
  registerUser: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

export default connect(state => ({ errors: state.errors }), { registerUser })(
  RegisterView
);
