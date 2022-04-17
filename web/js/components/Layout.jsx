import includes from "lodash/includes";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faTasks } from "@fortawesome/free-solid-svg-icons/faTasks";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons/faSignOutAlt";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { navigateTo } from "../lib/Navigation";
import { logout, loadTags, clearErrors } from "../actions";
import { ROUTE_ROOT, ROUTE_PROFILE, ROUTE_LOGIN } from "./Routes";
import { Container } from "./elements";
import { Affix, Dropdown, Nav, Navbar } from "rsuite";

export class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.hamburgerRef = React.createRef();
    this.menuRef = React.createRef();
    this.dropdownRef = React.createRef();

    this.state = {
      isMenuActive: false,
      isDropdownActive: false,
    };
  }

  componentDidMount() {
    document.addEventListener("click", this.handleClickOutside);

    // When the route changes, clear our errors
    window.addEventListener("navigate", () => {
      this.props.clearErrors();
    });

    this.props.loadTags();
  }

  handleClickToHome = () => {
    navigateTo(ROUTE_ROOT);
    this.closeMenus();
  };

  handleClickToProfile = () => {
    navigateTo(ROUTE_PROFILE);
    this.closeMenus();
  };

  handleClickToLogout = () => {
    this.props.logout();
    navigateTo(ROUTE_LOGIN);
    this.closeMenus();
  };

  handleClickOutside = (e) => {
    if (
      this.hamburgerRef?.current?.contains(e.target) ||
      this.menuRef?.current?.contains(e.target) ||
      this.dropdownRef?.current?.contains(e.target)
    ) {
      return;
    }

    this.closeMenus();
  };

  closeMenus = () => {
    this.setState(() => ({
      isMenuActive: false,
      isDropdownActive: false,
    }));
  };

  toggleMenu = () => {
    this.setState((state) => {
      return { isMenuActive: !state.isMenuActive };
    });
  };

  toggleDropdown = () => {
    this.setState((state) => {
      return { isDropdownActive: !state.isDropdownActive };
    });
  };

  render() {
    if (!includes(this.props.loaded, "user")) {
      return <div />;
    }

    return (
      <>
        <Affix>
          <Navbar>
            <Navbar.Brand onClick={this.handleClickToHome}>
              <Icon icon={faTasks} />
              {" Blueprint"}
            </Navbar.Brand>
            <Nav pullRight>
              <Dropdown icon={<Icon icon={faGear} />} title=" Settings">
                <Dropdown.Item
                  icon={<Icon icon={faUser} />}
                  eventKey="4"
                  onClick={this.handleClickToProfile}
                >
                  {" Profile"}
                </Dropdown.Item>
                <Dropdown.Item
                  icon={<Icon icon={faSignOutAlt} />}
                  eventKey="5"
                  onClick={this.handleClickToLogout}
                >
                  {" Logout"}
                </Dropdown.Item>
              </Dropdown>
            </Nav>
          </Navbar>
        </Affix>
        <Container>{this.props.children}</Container>
      </>
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
