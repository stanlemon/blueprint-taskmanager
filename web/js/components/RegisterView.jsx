import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { navigateTo } from "../lib/Navigation";
import { registerUser, clearErrors } from "../actions";
import { validate, UserForm } from "./UserForm";
import { Container, Button, Spacer, Center } from "./elements";
import {
  ROUTE_TERMS_OF_SERVICE,
  ROUTE_PRIVACY_POLICY,
  ROUTE_LOGIN,
} from "./Routes";
import { Blueprint, Divider } from "./elements";

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

  handleSubmit = (e) => {
    e.preventDefault();

    const errors = validate(this.state.data);

    // If there are any errors, bail
    if (Object.keys(errors).length > 0) {
      this.setState((state) => {
        return { ...state, ...{ errors } };
      });
      return;
    }

    // Clear out our errors
    this.setState((state) => {
      return { ...state, errors: {} };
    });

    this.props.registerUser(this.state.data);
  };

  setValue = (value, e) => {
    const key = e.target.name;

    this.setState((state) => {
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
      <Container>
        <Blueprint />
        <h2>Register an Account</h2>
        <Divider />
        <form id="register-form" onSubmit={this.handleSubmit}>
          <UserForm
            {...this.state.data}
            errors={errors}
            setValue={this.setValue}
          />

          <div>
            By registering with this service and creating an account you agree
            to the{" "}
            <Button onClick={() => navigateTo(ROUTE_TERMS_OF_SERVICE)}>
              Terms of Service
            </Button>{" "}
            and acknowledge that you have read and reviewed both it and the{" "}
            <Button onClick={() => navigateTo(ROUTE_PRIVACY_POLICY)}>
              Privacy Policy
            </Button>
            .
          </div>
          <Spacer />
          <Button
            id="register-button"
            type="submit"
            onClick={this.handleSubmit}
            is="primary"
          >
            Register
          </Button>
        </form>
        <Divider />
        <Spacer />
        <Center>
          <Button onClick={this.handleClickToLogin}>Return to Login</Button>
        </Center>
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
export default connect((state) => ({ errors: state.errors }), {
  registerUser,
  clearErrors,
})(RegisterView);
