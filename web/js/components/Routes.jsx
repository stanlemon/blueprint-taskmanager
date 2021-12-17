import React from "react";
import { Route } from "wouter";
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
      <SessionWatcher>
        <Route path={ROUTE_LOGIN}>
          <LoginView />
        </Route>
        <Route path={ROUTE_REGISTER}>
          <RegisterView />
        </Route>
        <Route path={ROUTE_VERIFY}>
          <VerifyEmailView />
        </Route>
        <Route path={ROUTE_TERMS_OF_SERVICE}>
          <TermsOfServiceView />
        </Route>
        <Route path={ROUTE_PRIVACY_POLICY}>
          <PrivacyPolicyView />
        </Route>
        {/* Everything contained below requires an authenticated user */}
        <Route path={ROUTE_ROOT}>
          <Layout>
            <TaskListView />
          </Layout>
        </Route>
        <Route path={ROUTE_TASK_VIEW}>
          <Layout>
            <TaskView />
          </Layout>
        </Route>
        <Route path={ROUTE_PROFILE}>
          <Layout>
            <ProfileView />
          </Layout>
        </Route>
      </SessionWatcher>
    );
  }
}
