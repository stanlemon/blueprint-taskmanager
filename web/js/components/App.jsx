import isEqual from 'lodash/lang/isEqual';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/';
import LoginForm from './LoginView';
import UserService from '../lib/UserService';

@connect( state => state , dispatch => {
    return { actions: bindActionCreators(actions, dispatch) };
})
export default class App extends React.Component {

    userService = new UserService();

    static defaultProps = {
        pollInterval: 3000
    }

    static propTypes = {
        pollInterval: React.PropTypes.number,
    }

    componentWillMount() {
        this.checkSession();

        setInterval(this.checkSession.bind(this), this.props.pollInterval);
    }

    checkSession() {
        this.userService.checkSession((err, prev, curr) => {
            if (err) {
                this.props.actions.error(err);
                return;
            }
            // Trigger an action when the state of the session changes
            if (!isEqual(prev, curr) || !this.props.loaded.has('user')) {
                this.props.actions.loadUser(curr);

                if (curr !== false) {
                    this.props.actions.loadTasks();
                }
            }
        });
    }

    logout(e) {
        e.preventDefault();
        this.props.actions.logout();
    }

    render() {
        if (!this.props.loaded.has('user')) {
            return <div/>
        }

        if (this.props.user === false) {
            return <LoginForm actions={this.props.actions}/>
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
