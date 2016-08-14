import { includes, omit } from 'lodash';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/';

class Root extends React.Component {

    static propTypes = {
        router: React.PropTypes.object,
        location: React.PropTypes.object,
        children: React.PropTypes.node,
        pollInterval: React.PropTypes.number,
        actions: React.PropTypes.object,
        loaded: React.PropTypes.array,
    };

    static propTypes = {
        children: React.PropTypes.node,
    };

    static defaultProps = {
        pollInterval: 10000,
    };

    interval;

    componentWillMount() {
        this.props.actions.checkSession();

        this.interval = setInterval(
            this.props.actions.checkSession,
            this.props.pollInterval
        );
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    componentWillReceiveProps(nextProps) {
        // User was not authenticated and is now
        if (includes(this.props.loaded, 'user') && this.props.user === false && nextProps.user !== false) {
            this.props.router.push('/');
        }

        const unauthPaths = [
            '/login',
            '/register',
        ];

        // Unauthenticated user is on a page they shouldn't be
        if (nextProps.user !== false && unauthPaths.indexOf(this.props.location.pathname) > -1) {
            this.props.router.push('/');
        }

        // Unauthenticated user is on a page they shouldn't be
        if (nextProps.user === false && unauthPaths.indexOf(this.props.location.pathname) === -1) {
            this.props.router.push('/login');
        }
    }

    render() {
        return React.cloneElement(this.props.children, omit(this.props, 'children'));
    }
}

export default connect(state => state, dispatch => {
    return { actions: bindActionCreators(actions, dispatch) };
})(Root);

