import isEmpty from "lodash/isEmpty";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";
import classNames from "classnames";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { navigateTo } from "../lib/Navigation";
import { registerUser } from "../actions/";

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
      <div className="container">
        <div className="row">
          <div className="col-xs-10 col-sm-8 col-xs-offset-1 col-sm-offset-2">
            <h2>Register an Account</h2>
            <form id="register-form" onSubmit={this.handleSubmit}>
              <div className="well">
                <div
                  className={classNames("form-group", {
                    "has-error": errors.name,
                  })}
                >
                  <label htmlFor="name" className="control-label">
                    Name
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={this.state.data.name}
                      onChange={this.setValue}
                    />
                    {errors.name && (
                      <span className="help-block">{errors.name}</span>
                    )}
                  </label>
                </div>
                <div
                  className={classNames("form-group", {
                    "has-error": errors.email,
                  })}
                >
                  <label htmlFor="email" className="control-label">
                    Email
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={this.state.data.email}
                      onChange={this.setValue}
                    />
                    {errors.email && (
                      <span className="help-block">{errors.email}</span>
                    )}
                  </label>
                </div>
                <div
                  className={classNames("form-group", {
                    "has-error": errors.password,
                  })}
                >
                  <label htmlFor="password" className="control-label">
                    Password
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={this.state.data.password}
                      onChange={this.setValue}
                    />
                    {errors.password && (
                      <span className="help-block">{errors.password}</span>
                    )}
                  </label>
                </div>
                <div
                  className={classNames("form-group", {
                    "has-error": errors.repeat_password,
                  })}
                >
                  <label htmlFor="password" className="control-label">
                    Repeat Password
                    <input
                      type="password"
                      className="form-control"
                      id="repeat_password"
                      name="repeat_password"
                      value={this.state.data.repeat_password}
                      onChange={this.setValue}
                    />
                    {errors.repeat_password && (
                      <span className="help-block">
                        {errors.repeat_password}
                      </span>
                    )}
                  </label>
                </div>
                <div className="form-group">
                  <button
                    id="register-button"
                    type="submit"
                    onClick={this.handleSubmit}
                    className="btn btn-primary col-sm-offset-5 col-sm-2"
                  >
                    Register
                  </button>
                </div>
                <div className="clearfix" />
              </div>
            </form>
            <div className="text-center">
              <a className="btn btn-link" onClick={this.handleClickToLogin}>
                Return to Login
              </a>
            </div>
          </div>
        </div>
      </div>
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
