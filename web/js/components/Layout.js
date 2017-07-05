import { includes } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

export default class Layout extends React.Component {
    static propTypes = {
        router: PropTypes.object.isRequired,
        children: PropTypes.node.isRequired,
        actions: PropTypes.object.isRequired,
        loaded: PropTypes.array,
    };

    static defaultProps = {
        actions: {},
        loaded: [],
    };

    componentWillMount() {
        this.props.actions.loadTasks();
    }

    home() {
        this.props.router.push('/');
    }

    logout(e) {
        e.preventDefault();
        this.props.actions.logout();
        this.props.actions.clearErrors();
        this.props.router.push('/login');
    }

    render() {
        if (!includes(this.props.loaded, 'user')) {
            return <div />;
        }

        return (
            <div>
                <nav className="navbar navbar-inverse navbar-fixed-top custom-navbar">
                    <div className="container">
                        <div className="navbar-header">
                            <a
                                role="button"
                                style={{ cursor: 'pointer' }}
                                className="navbar-brand"
                                onClick={this.home.bind(this)}
                                onTouchTap={this.home.bind(this)}
                            >
                                <i className="fa fa-cloud" />&nbsp; Blueprint
                            </a>
                        </div>
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <i
                                    role="button"
                                    style={{ cursor: 'pointer' }}
                                    className="navbar-brand fa fa-sign-out"
                                    onClick={this.logout.bind(this)}
                                    onTouchTap={this.logout.bind(this)}
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
