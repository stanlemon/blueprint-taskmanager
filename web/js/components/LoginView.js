import isEmpty from "lodash/isEmpty";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "../actions/";
import { navigateTo } from "../lib/Navigation";
import Error from "./Error";
import { Container, Field, Button } from "./elements/";

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
    navigateTo("/register");
  };

  handleSubmit = e => {
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
      this.setState(state => {
        return { ...state, ...{ errors } };
      });
      return;
    }

    // Clear out our errors
    this.setState(state => {
      return { ...state, errors: {} };
    });

    this.props.login(this.state.data);
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
    const errors = {
      // These errors came from the component's validation that occurred on a submit
      ...this.state.errors,
      // Errors are a map keyed to an array here, but we only want the first message off of the main key
      ...this.props.errors,
    };

    const { username, password } = this.state.data;

    return (
      <Container style={{ padding: 20, maxWidth: 500 }}>
        <h1 className="title">Login</h1>
        {Object.entries(errors).map(([key, value]) => (
          <Error key={key} message={value} />
        ))}
        <form className="login-form" onSubmit={this.handleSubmit}>
          <Field
            isHorizontal={true}
            icon="user"
            name="username"
            type="email"
            label="Email"
            value={username}
            onChange={this.setValue}
          />

          <Field
            isHorizontal={true}
            icon="lock"
            name="password"
            type="password"
            label="Password"
            value={password}
            onChange={this.setValue}
          />

          <div className="has-text-centered">
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
        <div className="has-text-centered" style={{ marginTop: "2rem" }}>
          <a
            id="create-account-button"
            is="link"
            onClick={this.handleClickToRegister}
          >
            Create Account
          </a>
        </div>
      </Container>
    );
  }
}

LoginView.propTypes = {
  login: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    main: PropTypes.string,
  }),
};

export default connect(state => ({ errors: state.errors }), { login })(
  LoginView
);
