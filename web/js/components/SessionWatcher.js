import isEqual from "lodash/isEqual";
import includes from "lodash/includes";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { checkSession } from "../actions/";
import { getCurrentPathname, navigateTo } from "../lib/Navigation";

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
    const path = getCurrentPathname();

    // User was authenticated and logged out
    if (
      includes(prevProps.loaded, "user") &&
      this.props.user === null &&
      prevProps.user !== null
    ) {
      navigateTo("/login");
      return;
    }

    const unauthPaths = ["/login", "/register"];

    // Authenticated user is on an unauthenticated page
    if (this.props.user !== null && unauthPaths.indexOf(path) > -1) {
      navigateTo("/");
      return;
    }

    // Unauthenticated user is on an authenticated page
    if (this.props.user === null && unauthPaths.indexOf(path) === -1) {
      navigateTo("/login");
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
