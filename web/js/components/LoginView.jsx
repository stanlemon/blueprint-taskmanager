import isEmpty from "lodash/isEmpty";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { login, clearErrors } from "../actions";
import { navigateTo } from "../lib/Navigation";
import Error from "./Error";
import {
  Container,
  Field,
  Button,
  Center,
  Spacer,
  Divider,
  Blueprint,
} from "./elements";
import { ROUTE_REGISTER } from "./Routes";

export class LoginView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      data: {
        username: "",
        password: "",
      },
    };
  }

  handleClickToRegister = () => {
    this.props.clearErrors();
    navigateTo(ROUTE_REGISTER);
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};

    if (isEmpty(this.state.data) || isEmpty(this.state.data.username)) {
      errors["username"] = "You must enter your username.";
    }

    if (isEmpty(this.state.data) || isEmpty(this.state.data.password)) {
      errors["password"] = "You must enter your password.";
    }

    // If there are any errors, bail
    if (Object.keys(errors).length > 0) {
      // If there is a client side error we clear out the server side error
      errors["main"] = false;

      this.setState((state) => {
        return { ...state, ...{ errors }, ...{ main: false } };
      });
      return;
    }

    // Clear out our errors
    this.setState((state) => {
      return { ...state, errors: {} };
    });

    this.props.login(this.state.data);
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
    const errors = {
      // Errors are a map keyed to an array here, but we only want the first message off of the main key
      ...this.props.errors,
      // These errors came from the component's validation that occurred on a submit
      ...this.state.errors,
    };

    const { username, password } = this.state.data;

    return (
      <Container>
        <Blueprint />
        <h2>Login</h2>
        <Divider />
        {errors.main && <Error message={errors.main} />}
        <form onSubmit={this.handleSubmit}>
          <Field
            isHorizontal={true}
            icon={faUser}
            name="username"
            type="email"
            label="Email"
            error={errors.username}
            value={username}
            onChange={this.setValue}
          />

          <Field
            isHorizontal={true}
            icon={faLock}
            name="password"
            type="password"
            label="Password"
            error={errors.password}
            value={password}
            onChange={this.setValue}
          />

          <div>
            <Button
              id="login-button"
              type="submit"
              onClick={this.handleSubmit}
              is="primary"
            >
              Login
            </Button>
          </div>
        </form>
        <Divider />
        <Spacer />
        <Center>
          <Button
            id="create-account-button"
            onClick={this.handleClickToRegister}
          >
            Create Account
          </Button>
        </Center>
      </Container>
    );
  }
}

LoginView.propTypes = {
  login: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    main: PropTypes.string,
  }),
};

/* istanbul ignore next */
export default connect((state) => ({ errors: state.errors }), {
  login,
  clearErrors,
})(LoginView);
