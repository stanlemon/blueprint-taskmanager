import isEqual from "lodash/isEqual";
import includes from "lodash/includes";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { checkSession } from "../actions/";
import { getCurrentPathname, navigateTo } from "../lib/Navigation";
import {
  ROUTE_ROOT,
  ROUTE_LOGIN,
  ROUTE_REGISTER,
  ROUTE_PRIVACY_POLICY,
  ROUTE_TERMS_OF_SERVICE,
} from "./Routes";

export class SessionWatcher extends React.Component {
  interval;

  componentDidMount() {
    this.props.checkSession();

    this.interval = setInterval(
      this.props.checkSession,
      this.props.pollInterval
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps, this.props);
  }

  componentDidUpdate(prevProps) {
    console.log("componentDidUpdate()", this.interval);
    const path = getCurrentPathname();
    console.log(path, this.props.user);
    // User was authenticated and logged out
    if (
      includes(prevProps.loaded, "user") &&
      this.props.user === null &&
      prevProps.user !== null
    ) {
      navigateTo(ROUTE_LOGIN);
      return;
    }

    const unauthPaths = [ROUTE_LOGIN, ROUTE_REGISTER];

    // Authenticated user is on an unauthenticated page
    if (this.props.user !== null && unauthPaths.indexOf(path) > -1) {
      navigateTo(ROUTE_ROOT);
      return;
    }

    const optPaths = [ROUTE_PRIVACY_POLICY, ROUTE_TERMS_OF_SERVICE];

    // User (auth or not) is on the verify page or any of the pages where auth is optional
    if (
      path.substring(0, "/verify/".length) === "/verify/" ||
      optPaths.indexOf(path) > -1
    ) {
      return;
    }

    // Unauthenticated user is on an authenticated page
    if (this.props.user === null && unauthPaths.indexOf(path) === -1) {
      navigateTo(ROUTE_LOGIN);
      return;
    }
  }

  render() {
    return this.props.children;
  }
}

SessionWatcher.defaultProps = {
  pollInterval: 30000,
  loaded: [],
};

SessionWatcher.propTypes = {
  children: PropTypes.node.isRequired,
  pollInterval: PropTypes.number,
  checkSession: PropTypes.func.isRequired,
  loaded: PropTypes.array.isRequired,
  user: PropTypes.object,
  history: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }),
  }),
};

export default connect(state => ({ loaded: state.loaded, user: state.user }), {
  checkSession,
})(SessionWatcher);
