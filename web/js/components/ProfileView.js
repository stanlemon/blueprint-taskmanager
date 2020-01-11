import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container } from "./elements";

export class ProfileView extends React.Component {
  render() {
    return (
      <Container>
        <div>Hello {this.props.user.name}!</div>
      </Container>
    );
  }
}

ProfileView.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default connect(state => ({ user: state.user }), {})(ProfileView);
