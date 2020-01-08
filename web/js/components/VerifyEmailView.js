import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import classNames from "classnames";
import { Container } from "./elements/";
import { getRouteParam, navigateTo } from "../lib/Navigation";
import { ROUTE_LOGIN, ROUTE_VERIFY } from "./Routes";
import UserService from "../lib/UserService";

export class VerifyEmailViewContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    const token = getRouteParam(ROUTE_VERIFY, "token");

    const userService = new UserService();
    userService.verify(token).then(res => {
      this.setState({ loaded: true, ...res });
    });
  }

  render() {
    return <VerifyEmailView {...this.state} />;
  }
}

const navigateToLogin = () => navigateTo(ROUTE_LOGIN);

export function VerifyEmailView({ loaded = false, success, message }) {
  return (
    <Container
      style={{
        paddingLeft: ".5rem",
        paddingRight: ".5rem",
        marginTop: "-2rem",
        marginBottom: "1rem",
      }}
    >
      {!loaded && (
        <div className="has-text-centered">
          <Icon icon={faSpinner} size="3x" spin />
          <div style={{ marginTop: 10 }}>
            <em>Verifying...</em>
          </div>
        </div>
      )}

      {loaded && (
        <div className="content">
          <h1
            className={classNames("has-text-centered", {
              "has-text-success": success,
              "has-text-danger": !success,
            })}
          >
            {message}
          </h1>
        </div>
      )}

      <div className="has-text-centered" style={{ marginTop: "2.5rem" }}>
        <a className="is-link" onClick={navigateToLogin}>
          Login to Blueprint
        </a>
      </div>
    </Container>
  );
}

VerifyEmailView.propTypes = {
  loaded: PropTypes.bool,
  success: PropTypes.bool,
  message: PropTypes.string,
};

export default VerifyEmailViewContainer;
