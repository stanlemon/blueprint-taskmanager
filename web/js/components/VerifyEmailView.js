import React from "react";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import classNames from "classnames";
import { Container } from "./elements/";
import { getRouteParam, navigateTo } from "../lib/Navigation";
import { ROUTE_LOGIN, ROUTE_VERIFY } from "./Routes";
import UserService from "../lib/UserService";

export class VerifyEmailView extends React.Component {
  componentDidMount() {
    const token = getRouteParam(ROUTE_VERIFY, "token");

    const userService = new UserService();
    userService.verify(token).then(res => {
      console.log(res);
      this.setState(res);
    });
  }

  navigateToLogin = () => navigateTo(ROUTE_LOGIN);

  render() {
    return (
      <Container
        style={{
          paddingLeft: ".5rem",
          paddingRight: ".5rem",
          marginTop: "-2rem",
          marginBottom: "1rem",
        }}
      >
        {!this.state && (
          <div className="has-text-centered">
            <Icon icon={faSpinner} size="3x" spin />
            <div style={{ marginTop: 10 }}>
              <em>Verifying...</em>
            </div>
          </div>
        )}

        {this.state && (
          <div className="content">
            <h1
              className={classNames("has-text-centered", {
                "has-text-success": this.state.success,
                "has-text-danger": !this.state.success,
              })}
            >
              {this.state.message}
            </h1>
          </div>
        )}

        <div className="has-text-centered" style={{ marginTop: "2.5rem" }}>
          <a className="is-link" onClick={this.navigateToLogin}>
            Login to Blueprint
          </a>
        </div>
      </Container>
    );
  }
}

VerifyEmailView.propTypes = {};

export default VerifyEmailView;
