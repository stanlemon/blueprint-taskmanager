import { includes, omit } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/';

class Root extends React.Component {
    /*
    static propTypes = {
        router: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        children: PropTypes.node.isRequired,
        pollInterval: PropTypes.number,
        actions: PropTypes.object.isRequired,
        loaded: PropTypes.array.isRequired,
        user: PropTypes.object,
    };
    */

    static defaultProps = {
        actions: {},
        loaded: [],
        pollInterval: 10000,
        user: null,
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

    shouldComponentUpdate(nextProps) {
        // User was not authenticated and is now
        if (
            includes(this.props.loaded, 'user') &&
            this.props.user === null &&
            nextProps.user !== null
        ) {
            this.props.router.history.push('/');
            return false;
        }

        const unauthPaths = ['/login', '/register'];

        // Unauthenticated user is on a page they shouldn't be
        if (
            nextProps.user !== null &&
            unauthPaths.indexOf(this.props.router.route.location.pathname) > -1
        ) {
            this.props.router.history.push('/');
            return false;
        }

        // Unauthenticated user is on a page they shouldn't be
        if (
            nextProps.user === null &&
            unauthPaths.indexOf(this.props.router.route.location.pathname) === -1
        ) {
            this.props.router.history.push('/login');
            return false;
        }

        return true;
    }

    render() {
        return React.cloneElement(
            this.props.children,
            omit(this.props, 'children')
        );
    }
}

export default withRouter(connect(
    state => state,
    dispatch => ({ actions: bindActionCreators(actions, dispatch) })
)(Root));
