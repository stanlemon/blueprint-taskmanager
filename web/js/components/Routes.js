import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import SessionWatcher from "./SessionWatcher";
import Layout from "./Layout";
import LoginView from "./LoginView";
import TaskListView from "./TaskListView";
import TaskView from "./TaskView";
import RegisterView from "./RegisterView";
import VerifyEmailView from "./VerifyEmailView";
import TermsOfServiceView from "./TermsOfServiceView";
import PrivacyPolicyView from "./PrivacyPolicyView";
import ProfileView from "./ProfileView";
import { history } from "../lib/Navigation";

// Routes should be declared here, then used in the <Route /> component.
// This allows them to be referenced consistently from other places in code.

export const ROUTE_LOGIN = "/login";
export const ROUTE_REGISTER = "/register";
export const ROUTE_TERMS_OF_SERVICE = "/terms";
export const ROUTE_PRIVACY_POLICY = "/privacy";
export const ROUTE_VERIFY = "/verify/:token";
export const ROUTE_ROOT = "/";
export const ROUTE_TASK_VIEW = "/view/:id";
export const ROUTE_PROFILE = "/profile";

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
              {/* Everything contained herein requires an authenticated user */}
              <Layout>
                <Switch>
                  <Route exact path={ROUTE_ROOT}>
                    <TaskListView />
                  </Route>
                  <Route exact path={ROUTE_TASK_VIEW}>
                    <TaskView />
                  </Route>
                  <Route exact path={ROUTE_PROFILE}>
                    <ProfileView />
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
