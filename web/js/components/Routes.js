import React from 'react';
import PropTypes from 'prop-types';
import { Router, Switch, Route } from 'react-router-dom';
import SessionWatcher from './SessionWatcher';
import Layout from './Layout';
import LoginView from './LoginView';
import RegisterView from './RegisterView';
import TaskListView from './TaskListView';
import TaskView from './TaskView';
import { createHashHistory } from 'history';

const history = createHashHistory();

export default function Routes(props) {
    // Allows us to abstract away react router & the history implementation from our stuff
    function navigateTo(route) {
        history.push(route);
        // Capture our route in redux, this is important to ensure navigation changes state
        // in the SessionWatcher correctly.
        props.actions.storePath(route);
    }

    return (
        <Router history={history}>
            <SessionWatcher
                {...props}
                path={history.location.pathname}
                navigateTo={navigateTo}
            >
                <Switch>
                    <Route exact path="/login">
                        <LoginView {...props} navigateTo={navigateTo} />
                    </Route>
                    <Route exact path="/register">
                        <RegisterView {...props} navigateTo={navigateTo} />
                    </Route>
                    npm
                    <Route exact path="/">
                        <Layout {...props} navigateTo={navigateTo}>
                            <TaskListView {...props} navigateTo={navigateTo} />
                        </Layout>
                    </Route>
                    <Route
                        exact
                        path="/view/:id"
                        render={router => (
                            <Layout {...props} navigateTo={navigateTo}>
                                <TaskView
                                    {...props}
                                    navigateTo={navigateTo}
                                    taskId={parseInt(
                                        router.match.params.id,
                                        10
                                    )}
                                />
                            </Layout>
                        )}
                    />
                </Switch>
            </SessionWatcher>
        </Router>
    );
}

Routes.propTypes = {
    actions: PropTypes.object.isRequired,
};
