import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import SessionWatcher from './SessionWatcher';
import Layout from './Layout';
import LoginView from './LoginView';
import RegisterView from './RegisterView';
import TaskListView from './TaskListView';
import TaskView from './TaskView';
import { createBrowserHistory } from 'history';

export default class Routes extends React.Component {
    history = createBrowserHistory();

    render() {
        // Allows us to abstract away react router & the history implementation from our stuff
        const navigateTo = route => {
            this.history.push(route);
        };

        return (
            <Router history={this.history}>
                <SessionWatcher navigateTo={navigateTo}>
                    <Switch>
                        <Route exact path="/login">
                            <LoginView navigateTo={navigateTo} />
                        </Route>
                        <Route exact path="/register">
                            <RegisterView navigateTo={navigateTo} />
                        </Route>
                        <Route exact path="/">
                            <Layout navigateTo={navigateTo}>
                                <TaskListView navigateTo={navigateTo} />
                            </Layout>
                        </Route>
                        <Route exact path="/view/:id">
                            <Layout navigateTo={navigateTo}>
                                <TaskView navigateTo={navigateTo} />
                            </Layout>
                        </Route>
                    </Switch>
                </SessionWatcher>
            </Router>
        );
    }
}
