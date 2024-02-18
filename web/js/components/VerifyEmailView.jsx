import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { Button, Center, Container, Notification, Spacer } from "./elements/";
import { getRouteParam, navigateTo } from "../lib/Navigation";
import { ROUTE_LOGIN, ROUTE_VERIFY } from "./Routes";
import { verify } from "../actions/";

export function VerifyEmailView({ loaded = false, success, message }) {
  return (
    <Container>
      {!loaded && (
        <Center>
          <Icon icon={faSpinner} size="3x" spin />
          <Spacer />
          <div>
            <em>Verifying...</em>
          </div>
        </Center>
      )}

      {loaded && (
        <Container>
          {success ? (
            <Notification is="success">{message}</Notification>
          ) : (
            <Notification is="error">{message}</Notification>
          )}
        </Container>
      )}

      <Spacer />
      <Center>
        <Button onClick={() => navigateTo(ROUTE_LOGIN)}>
          Login to Blueprint
        </Button>
      </Center>
    </Container>
  );
}

VerifyEmailView.propTypes = {
  loaded: PropTypes.bool,
  success: PropTypes.bool,
  message: PropTypes.string,
};

export class VerifyEmailViewContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
    };
  }

  async componentDidMount() {
    const token = getRouteParam(ROUTE_VERIFY, "token");

    try {
      const response = await this.props.verify(token);

      this.setState({ loaded: true, ...response });
    } catch (error) {
      console.error(error);

      this.setState({
        loaded: true,
        ...error.errors,
      });
    }
  }

  render() {
    return <VerifyEmailView {...this.state} />;
  }
}

VerifyEmailViewContainer.propTypes = {
  verify: PropTypes.func.isRequired,
};

/* istanbul ignore next */
export default connect(() => ({}), {
  verify,
})(VerifyEmailViewContainer);
