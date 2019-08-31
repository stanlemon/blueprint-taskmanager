import includes from 'lodash/includes';
import React from 'react';
import PropTypes from 'prop-types';

export default class Layout extends React.Component {
    static propTypes = {
        navigateTo: PropTypes.func.isRequired,
        children: PropTypes.node.isRequired,
        actions: PropTypes.object.isRequired,
        loaded: PropTypes.array,
    };

    static defaultProps = {
        actions: {},
        loaded: [],
    };

    componentDidMount() {
        this.props.actions.loadTasks();
    }

    handleClickToHome = () => {
        this.props.navigateTo('/');
    };

    handleClickToLogout = () => {
        this.props.actions.logout();
        this.props.actions.clearErrors();
        this.props.navigateTo('/login');
    };

    render() {
        if (!includes(this.props.loaded, 'user')) {
            return <div />;
        }

        return (
            <div>
                <nav className="navbar navbar-inverse navbar-fixed-top custom-navbar">
                    <div className="container">
                        <div className="navbar-header">
                            <button
                                style={{ cursor: 'pointer' }}
                                className="navbar-brand btn-link"
                                onClick={this.handleClickToHome}
                            >
                                <i className="fa fa-cloud" />
                                &nbsp; Blueprint
                            </button>
                        </div>
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <i
                                    role="button"
                                    style={{ cursor: 'pointer' }}
                                    className="navbar-brand fa fa-sign-out"
                                    onClick={this.handleClickToLogout}
                                    onKeyDown={this.handleClickToLogout}
                                    tabIndex={0}
                                />
                            </li>
                        </ul>
                    </div>
                </nav>
                <div className="container">
                    {React.cloneElement(this.props.children, this.props)}
                </div>
            </div>
        );
    }
}
