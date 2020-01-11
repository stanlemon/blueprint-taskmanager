import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { saveUser } from "../actions";
import { validate, UserForm, UserPropTypes } from "./UserForm";
import { Container, Button } from "./elements";

export class ProfileView extends React.Component {
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

  handleSubmit = e => {
    e.preventDefault();

    const errors = validate(this.state.data, { requirePassword: false });

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

    this.props.saveUser(this.state.data);
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
      <Container>
        <h1 className="title">Profile</h1>
        <hr />
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

export default connect(state => ({ user: state.user, errors: state.errors }), {
  saveUser,
})(ProfileView);
