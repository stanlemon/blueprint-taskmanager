import { isEqual, includes } from 'lodash';
import React from 'react';
import UserService from '../lib/UserService';

export default class App extends React.Component {

    static propTypes = {
        router: React.PropTypes.object,
        children: React.PropTypes.node,
        pollInterval: React.PropTypes.number,
        actions: React.PropTypes.object,
        loaded: React.PropTypes.array,
    };

    static defaultProps = {
        pollInterval: 3000,
    };

    userService = new UserService();
    interval;

    componentWillMount() {
        this.checkSession();
        this.interval = setInterval(this.checkSession.bind(this), this.props.pollInterval);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    checkSession() {
        this.userService.checkSession((err, prev, curr) => {
            if (err) {
                this.props.actions.addError(err);
                return;
            }

            // Trigger an action when the state of the session changes
            if (!isEqual(prev, curr) || !includes(this.props.loaded, 'user')) {
                this.props.actions.loadUser(curr);

                if (curr !== false) {
                    this.props.actions.loadTasks();
                }
            }

            // If we are not logged in redirect them to the login page
            if (curr === false) {
                this.props.router.push('/login');
            }
        });
    }

    home() {
        this.props.router.push('/');
    }

    logout(e) {
        e.preventDefault();
        this.props.actions.logout();
        this.props.actions.addErrors({});
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
                              style={{ cursor: 'pointer' }}
                              className="navbar-brand"
                              onTouchTap={this.home.bind(this)}
                            >
                                <i className="fa fa-cloud" />&nbsp;
                                Blueprint
                            </a>
                        </div>
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <a href="#" className="fa fa-sign-out" onTouchTap={this.logout.bind(this)} />
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
