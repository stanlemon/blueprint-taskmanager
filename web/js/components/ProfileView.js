import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { saveUser } from "../actions";
import { validate, UserForm, UserPropTypes } from "./UserForm";
import { Container, Button, Notification } from "./elements";

export class ProfileView extends React.Component {
  notificationTimeout;

  constructor(props) {
    super(props);

    this.state = {
      data: {
        name: props.user.name,
        email: props.user.email,
        password: "",
        repeat_password: "",
      },
      errors: {},
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate(this.state.data, { requirePassword: false });

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

    await this.props.saveUser(this.state.data);

    this.setState((state) => ({
      ...state,
      message: "Profile successfully updated!",
    }));

    // TODO: Fade this out, rather than just make it disappear
    this.notificationTimeout = setTimeout(
      () => this.setState((state) => ({ ...state, message: null })),
      7500 // 7.5 seconds
    );
  };

  setValue = (e) => {
    const key = e.target.name;
    const value = e.target.value;

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
        <h1 className="title">Profile</h1>
        <hr />
        {this.state.message && (
          <Notification is="success">{this.state.message}</Notification>
        )}
        <UserForm
          {...this.state.data}
          errors={errors}
          setValue={this.setValue}
        />
        <Button
          id="save"
          type="submit"
          onClick={this.handleSubmit}
          is="primary"
          style={{ marginTop: "1.5rem" }}
        >
          Save
        </Button>
      </Container>
    );
  }
}

ProfileView.propTypes = {
  errors: PropTypes.shape(UserPropTypes),
  user: PropTypes.shape(UserPropTypes),
  saveUser: PropTypes.func,
};

/* istanbul ignore next */
export default connect(({ user, errors }) => ({ user, errors }), {
  saveUser,
})(ProfileView);
