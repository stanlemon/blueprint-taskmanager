import isEmpty from "lodash/isEmpty";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "../actions/";
import { navigateTo } from "../lib/Navigation";
import Error from "./Error";
import { Container, Columns, Column, Field, Button } from "./elements/";

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
      <Container style={{ padding: 10 }}>
        <Columns>
          <Column size={6} offset={3}>
            {Object.entries(errors).map(([key, value]) => (
              <Error key={key} message={value} />
            ))}
          </Column>
        </Columns>
        <Columns>
          <Column size={6} offset={3}>
            <div className="panel panel-info">
              <div className="panel-heading">
                <h3 className="panel-title">
                  <strong>Login</strong>
                </h3>
              </div>
              <div className="panel-body">
                <div className="form-horizontal">
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

                    <Columns>
                      <Column size={8} offset={2}>
                        <Button
                          id="login-button"
                          type="submit"
                          onClick={this.handleSubmit}
                          is="primary"
                        >
                          Login
                        </Button>
                      </Column>
                    </Columns>
                  </form>
                </div>
              </div>
            </div>
          </Column>
        </Columns>
        <div style={{ minHeight: "15px" }} />
        <div className="row">
          <div className="text-center">
            <a
              id="create-account-button"
              className="btn btn-link"
              onClick={this.handleClickToRegister}
            >
              Create Account
            </a>
          </div>
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
