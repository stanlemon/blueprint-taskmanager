import isEqual from 'lodash/isEqual';
import includes from 'lodash/includes';
import React from 'react';
import PropTypes from 'prop-types';

export default class SessionWatcher extends React.Component {
    static propTypes = {
        navigateTo: PropTypes.func.isRequired,
        path: PropTypes.string.isRequired,
        children: PropTypes.node.isRequired,
        pollInterval: PropTypes.number,
        actions: PropTypes.object.isRequired,
        loaded: PropTypes.array.isRequired,
        user: PropTypes.object,
    };

    static defaultProps = {
        actions: {},
        loaded: [],
        pollInterval: 10000,
        user: null,
    };

    interval;

    componentDidMount() {
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
        return !isEqual(nextProps, this.props);
    }

    componentDidUpdate(prevProps) {
        // User was authenticated and logged out
        if (
            includes(prevProps.loaded, 'user') &&
            this.props.user === null &&
            prevProps.user !== null
        ) {
            this.props.navigateTo('/login');
            return;
        }

        const unauthPaths = ['/login', '/register'];

        // Authenticated user is on an unauthenticated page
        if (
            this.props.user !== null &&
            unauthPaths.indexOf(this.props.path) > -1
        ) {
            this.props.navigateTo('/');
            return;
        }

        // Unauthenticated user is on an authenticated page
        if (
            this.props.user === null &&
            unauthPaths.indexOf(this.props.path) === -1
        ) {
            this.props.navigateTo('/login');
            return;
        }
    }

    render() {
        return React.cloneElement(this.props.children, this.props);
    }
}
