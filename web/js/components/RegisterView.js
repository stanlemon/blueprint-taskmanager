import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { navigateTo } from "../lib/Navigation";
import { registerUser, clearErrors } from "../actions/";
import { validate, UserForm } from "./UserForm";
import { Container, Button } from "./elements/";
import {
  ROUTE_TERMS_OF_SERVICE,
  ROUTE_PRIVACY_POLICY,
  ROUTE_LOGIN,
} from "./Routes";
import Blueprint from "./elements/Blueprint";

export class RegisterView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        name: "",
        email: "",
        password: "",
        repeat_password: "",
      },
    };
  }

  handleClickToLogin = () => {
    this.props.clearErrors();
    navigateTo(ROUTE_LOGIN);
  };

  handleSubmit = e => {
    e.preventDefault();

    const errors = validate(this.state.data);

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
          marginTop: "-2rem",
          marginBottom: "1rem",
        }}
      >
        <Blueprint />
        <h2 className="subtitle is-2">Register an Account</h2>
        <hr />
        <form id="register-form" onSubmit={this.handleSubmit}>
          <UserForm
            {...this.state.data}
            errors={errors}
            setValue={this.setValue}
          />

          <div className="content">
            By registering with this service and creating an account you agree
            to the{" "}
            <a
              className="is-link"
              onClick={() => navigateTo(ROUTE_TERMS_OF_SERVICE)}
            >
              Terms of Service
            </a>{" "}
            and acknowledge that you have read and reviewed both it and the{" "}
            <a
              className="is-link"
              onClick={() => navigateTo(ROUTE_PRIVACY_POLICY)}
            >
              Privacy Policy
            </a>
            .
          </div>
          <Button
            id="register-button"
            type="submit"
            onClick={this.handleSubmit}
            is="primary"
            style={{ marginTop: "1.5rem" }}
          >
            Register
          </Button>
        </form>
        <hr />
        <div className="has-text-centered" style={{ marginTop: "2.5rem" }}>
          <a className="is-link" onClick={this.handleClickToLogin}>
            Return to Login
          </a>
        </div>
      </Container>
    );
  }
}

RegisterView.propTypes = {
  registerUser: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

/* istanbul ignore next */
export default connect(state => ({ errors: state.errors }), {
  registerUser,
  clearErrors,
})(RegisterView);
