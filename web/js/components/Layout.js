import includes from "lodash/includes";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { navigateTo } from "../lib/Navigation";
import { logout, loadTasks } from "../actions/";

export class Layout extends React.Component {
  componentDidMount() {
    this.props.loadTasks();
  }

  handleClickToHome = () => {
    navigateTo("/");
  };

  handleClickToLogout = () => {
    this.props.logout();
    navigateTo("/login");
  };

  render() {
    if (!includes(this.props.loaded, "user")) {
      return <div />;
    }

    return (
      <div>
        <nav className="navbar navbar-inverse navbar-fixed-top custom-navbar">
          <div className="container">
            <div className="navbar-header">
              <a
                style={{ cursor: "pointer" }}
                className="navbar-brand btn-link"
                onClick={this.handleClickToHome}
              >
                <i className="fa fa-cloud" />
                &nbsp; Blueprint
              </a>
            </div>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <i
                  id="logout"
                  role="button"
                  style={{ cursor: "pointer" }}
                  className="navbar-brand fa fa-sign-out"
                  onClick={this.handleClickToLogout}
                />
              </li>
            </ul>
          </div>
        </nav>
        <div className="container">{this.props.children}</div>
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  logout: PropTypes.func.isRequired,
  loadTasks: PropTypes.func.isRequired,
  loaded: PropTypes.array,
};

export default connect(
  state => ({ loaded: state.loaded }),
  { logout, loadTasks }
)(Layout);
