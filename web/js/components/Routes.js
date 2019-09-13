import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import SessionWatcher from "./SessionWatcher";
import Layout from "./Layout";
import LoginView from "./LoginView";
import RegisterView from "./RegisterView";
import TaskListView from "./TaskListView";
import TaskView from "./TaskView";
import { history, navigateTo } from "../lib/navigateTo";

// Routes should be declared here, then used in the <Route /> component.
// This allows them to be referenced consistently from other places in code.

export const ROUTE_LOGIN = "/login";
export const ROUTE_REGISTER = "/register";
export const ROUTE_ROOT = "/";
export const ROUTE_TASK_VIEW = "/view/:id";

// TODO: Stop passing navigateTo() around everywhere

export default class Routes extends React.Component {
  render() {
    return (
      <Router history={history}>
        <SessionWatcher navigateTo={navigateTo}>
          <Switch>
            <Route exact path={ROUTE_LOGIN}>
              <LoginView navigateTo={navigateTo} />
            </Route>
            <Route exact path={ROUTE_REGISTER}>
              <RegisterView navigateTo={navigateTo} />
            </Route>
            <Route exact path={ROUTE_ROOT}>
              <Layout navigateTo={navigateTo}>
                <TaskListView navigateTo={navigateTo} />
              </Layout>
            </Route>
            <Route exact path={ROUTE_TASK_VIEW}>
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
