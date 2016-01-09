/* @flow weak */
import { isEqual, contains, omit } from 'lodash';
import React from 'react';
import LoginView from './LoginView';
import UserService from '../lib/UserService';

export default class App extends React.Component {

    userService = new UserService();

    static defaultProps = {
        pollInterval: 3000
    };

    static propTypes = {
        pollInterval: React.PropTypes.number,
    };

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
            if (!isEqual(prev, curr) || !contains(this.props.loaded, 'user')) {
                this.props.actions.loadUser(curr);

                if (curr !== false) {
                    this.props.actions.loadTasks();
                }
            }

            // If we are not logged in redirect them to the login page
            if (curr === false) {
                this.props.history.pushState(null, '/login');
            }
        });
    }

    logout(e) {
        e.preventDefault();
        this.props.actions.logout();
        this.props.history.pushState(null, '/login');
    }

    render() {
        if (!contains(this.props.loaded, 'user')) {
            return <div/>
        }

        let year = (new Date()).getFullYear();

        return (
            <div>
                <nav className="navbar navbar-inverse navbar-fixed-top custom-navbar">
                    <div className="container">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">
                                <i className="fa fa-cloud"/>&nbsp;
                                Blueprint
                            </a>
                        </div>
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <a href="#" className="fa fa-sign-out" onClick={this.logout.bind(this)}/>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div className="container">
                    <div>
                        {React.cloneElement(this.props.children, this.props)}
                    </div>
                    <div className="clearfix"></div>

                    <hr />
                    <footer>
                        <p>&copy; {year} Copyright</p>
                    </footer>
                </div>
            </div>
        );
    }
}
