/* @flow weak */
import { isEqual, contains } from 'lodash';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/';
import UserService from '../lib/UserService';
import App from './App';

class Root extends React.Component {

    userService = new UserService();

    static defaultProps = {
        pollInterval: 3000
    };

    static propTypes = {
        pollInterval: React.PropTypes.number,
    };

    componentWillMount() {
        this.checkSession();

        setInterval(this.checkSession.bind(this), this.props.pollInterval);
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
        });
    }

    render() {
        return <App {...this.props}>{React.cloneElement(this.props.children, this.props)}</App>
    }
}

export default connect( state => state , dispatch => {
    return { actions: bindActionCreators(actions, dispatch) };
})(Root);
