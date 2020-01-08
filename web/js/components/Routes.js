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
export const ROUTE_VERIFY = "/verify/:token";
export const ROUTE_ROOT = "/";
export const ROUTE_TASK_VIEW = "/view/:id";
export const ROUTE_TERMS_OF_SERVICE = "/terms";
export const ROUTE_PRIVACY_POLICY = "/privacy";

const RegisterView = loadable(() => import("./RegisterView"));
const VerifyEmailView = loadable(() => import("./VerifyEmailView"));
const TermsOfServiceView = loadable(() => import("./TermsOfServiceView"));
const PrivacyPolicyView = loadable(() => import("./PrivacyPolicyView"));

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
            <Route exact path={ROUTE_VERIFY}>
              <VerifyEmailView />
            </Route>
            <Route exact path={ROUTE_TERMS_OF_SERVICE}>
              <TermsOfServiceView />
            </Route>
            <Route exact path={ROUTE_PRIVACY_POLICY}>
              <PrivacyPolicyView />
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
