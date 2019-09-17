import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import loadable from "@loadable/component";
import SessionWatcher from "./SessionWatcher";
import Layout from "./Layout";
import LoginView from "./LoginView";
import TaskListView from "./TaskListView";
import TaskView from "./TaskView";
import { history } from "../lib/Navigation";

// Routes should be declared here, then used in the <Route /> component.
// This allows them to be referenced consistently from other places in code.

export const ROUTE_LOGIN = "/login";
export const ROUTE_REGISTER = "/register";
export const ROUTE_ROOT = "/";
export const ROUTE_TASK_VIEW = "/view/:id";

const RegisterView = loadable(() => import("./RegisterView"));

export default class Routes extends React.Component {
  render() {
    return (
      <Router history={history}>
        <SessionWatcher>
          <Switch>
            <Route exact path={ROUTE_LOGIN}>
              <LoginView />
            </Route>
            <Route exact path={ROUTE_REGISTER}>
              <RegisterView />
            </Route>
            <Route>
              {/* Everything container herein requires an authenticated user */}
              <Layout>
                <Switch>
                  <Route exact path={ROUTE_ROOT}>
                    <TaskListView />
                  </Route>
                  <Route exact path={ROUTE_TASK_VIEW}>
                    <TaskView />
                  </Route>
                </Switch>
              </Layout>
            </Route>
          </Switch>
        </SessionWatcher>
      </Router>
    );
  }
}
