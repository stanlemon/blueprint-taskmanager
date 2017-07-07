import { includes } from 'lodash';
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
            this.props.navigateTo('/');
            return false;
        }

        const unauthPaths = ['/login', '/register'];

        // Unauthenticated user is on a page they shouldn't be
        if (
            nextProps.user !== null &&
            unauthPaths.indexOf(this.props.path) > -1
        ) {
            this.props.navigateTo('/');
            return false;
        }

        // Unauthenticated user is on a page they shouldn't be
        if (
            nextProps.user === null &&
            unauthPaths.indexOf(this.props.path) === -1
        ) {
            this.props.navigateTo('/login');
            return false;
        }

        return true;
    }

    render() {
        return React.cloneElement(this.props.children, this.props);
    }
}
