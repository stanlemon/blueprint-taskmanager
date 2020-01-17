import includes from "lodash/includes";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classNames from "classnames";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faTasks } from "@fortawesome/free-solid-svg-icons/faTasks";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons/faSignOutAlt";
import { navigateTo, history } from "../lib/Navigation";
import { logout, loadTags, clearErrors } from "../actions/";
import { ROUTE_ROOT, ROUTE_PROFILE, ROUTE_LOGIN } from "./Routes";

export class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuActive: false,
    };
  }

  componentDidMount() {
    // When the route changes, clear our errors
    history.listen(() => {
      this.props.clearErrors();
    });
    this.props.loadTags();
  }

  handleClickToHome = () => {
    navigateTo(ROUTE_ROOT);
  };

  handleClickToProfile = () => {
    navigateTo(ROUTE_PROFILE);
  };

  handleClickToLogout = () => {
    this.props.logout();
    navigateTo(ROUTE_LOGIN);
  };

  toggleMenu = () => {
    this.setState(state => {
      return { isMenuActive: !state.isMenuActive };
    });
  };

  render() {
    if (!includes(this.props.loaded, "user")) {
      return <div />;
    }

    return (
      <div>
        <nav
          className="navbar has-shadow is-fixed-top"
          role="navigation"
          aria-label="main navigation"
        >
          <div className="navbar-brand">
            <a
              className="navbar-item has-text-link"
              onClick={this.handleClickToHome}
            >
              <span className="icon" style={{ marginLeft: 10 }}>
                <Icon icon={faTasks} size="lg" />
              </span>
              <span style={{ marginLeft: 12 }}>Blueprint</span>
            </a>

            <a
              role="button"
              className={classNames("navbar-burger", "burger", {
                "is-active": this.state.isMenuActive,
              })}
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarBasicExample"
              onClick={this.toggleMenu}
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>
          <div
            className={classNames("navbar-menu", {
              "is-active": this.state.isMenuActive,
            })}
          >
            <div className="navbar-start"></div>
            <div className="navbar-end">
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link" id="user-menu">
                  {this.props.user.name}
                </a>
                <div className="navbar-dropdown is-right">
                  <a
                    id="profile"
                    className="navbar-item"
                    onClick={this.handleClickToProfile}
                  >
                    <span className="icon">
                      <Icon icon={faUser} />
                    </span>
                    <span>Profile</span>
                  </a>
                  <a
                    id="logout"
                    className="navbar-item"
                    onClick={this.handleClickToLogout}
                  >
                    <span className="icon">
                      <Icon icon={faSignOutAlt} />
                    </span>
                    <span>Logout</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div style={{ maxWidth: 900, padding: 15 }} className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  logout: PropTypes.func.isRequired,
  loadTags: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  loaded: PropTypes.array,
  user: PropTypes.shape({
    name: PropTypes.string,
  }),
};

/* istanbul ignore next */
export default connect(({ loaded, user }) => ({ loaded, user }), {
  logout,
  loadTags,
  clearErrors,
})(Layout);
