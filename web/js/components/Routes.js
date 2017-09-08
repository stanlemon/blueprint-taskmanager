import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import SessionWatcher from './SessionWatcher';
import Layout from './Layout';
import LoginView from './LoginView';
import RegisterView from './RegisterView';
import TaskListView from './TaskListView';
import TaskView from './TaskView';
import createHashHistory from 'history/createHashHistory';

const history = createHashHistory();

function navigateTo(route) {
    history.push(route);
}

export default function Routes(props) {
    return (
        <Router history={history}>
            <SessionWatcher
                {...props}
                path={history.location.pathname}
                navigateTo={navigateTo}
            >
                <Switch>
                    <Route path="/login">
                        <LoginView {...props} navigateTo={navigateTo} />
                    </Route>
                    <Route path="/register">
                        <RegisterView {...props} navigateTo={navigateTo} />
                        )}
                    </Route>
                    <Route path="/">
                        <Layout {...props} navigateTo={navigateTo}>
                            <Switch>
                                <Route exact path="/">
                                    <TaskListView
                                        {...props}
                                        navigateTo={navigateTo}
                                    />
                                </Route>
                                <Route
                                    exact
                                    path="/view/:id"
                                    render={router => (
                                        <TaskView
                                            {...props}
                                            navigateTo={navigateTo}
                                            taskId={parseInt(
                                                router.match.params.id,
                                                10
                                            )}
                                        />
                                    )}
                                />
                            </Switch>
                        </Layout>
                    </Route>
                </Switch>
            </SessionWatcher>
        </Router>
    );
}
