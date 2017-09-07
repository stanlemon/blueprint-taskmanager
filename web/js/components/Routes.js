import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import SessionWatcher from './SessionWatcher';
import Layout from './Layout';
import LoginView from './LoginView';
import RegisterView from './RegisterView';
import TaskListView from './TaskListView';
import TaskView from './TaskView';

// Wraps react-router to future proof against API changes
function navigateTo(route) {
    this.history.push(route);
}

export default function Routes(props) {
    return (
        <Router>
            <Route
                path="/"
                render={router => (
                    <SessionWatcher
                        {...props}
                        path={router.location.pathname}
                        navigateTo={navigateTo.bind(router)}
                    >
                        <Switch>
                            <Route
                                path="/login"
                                render={router => (
                                    <LoginView
                                        {...props}
                                        navigateTo={navigateTo.bind(router)}
                                    />
                                )}
                            />
                            <Route
                                path="/register"
                                render={router => (
                                    <RegisterView
                                        {...props}
                                        navigateTo={navigateTo.bind(router)}
                                    />
                                )}
                            />
                            <Route
                                path="/"
                                render={router => (
                                    <Layout
                                        {...props}
                                        navigateTo={navigateTo.bind(router)}
                                    >
                                        <Switch>
                                            <Route
                                                exact
                                                path="/"
                                                render={router => (
                                                    <TaskListView
                                                        {...props}
                                                        navigateTo={navigateTo.bind(
                                                            router
                                                        )}
                                                    />
                                                )}
                                            />
                                            <Route
                                                exact
                                                path="/view/:id"
                                                render={router => (
                                                    <TaskView
                                                        {...props}
                                                        navigateTo={navigateTo.bind(
                                                            router
                                                        )}
                                                        taskId={parseInt(
                                                            router.match.params
                                                                .id,
                                                            10
                                                        )}
                                                    />
                                                )}
                                            />
                                        </Switch>
                                    </Layout>
                                )}
                            />
                        </Switch>
                    </SessionWatcher>
                )}
            />
        </Router>
    );
}
