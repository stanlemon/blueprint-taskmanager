import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { SessionWatcher } from "./SessionWatcher";
import { history } from "../lib/navigateTo";
import { ROUTE_LOGIN, ROUTE_ROOT } from "./Routes";

configure({ adapter: new Adapter() });

describe("<SessionWatcher />", () => {
  const checkSession = () => ({});

  it("renders children", () => {
    history.replace("/");

    // Initial state user is null, unauthed
    const view = shallow(
      <SessionWatcher checkSession={checkSession}>
        <h1>Hello World</h1>
      </SessionWatcher>
    );

    // SessionWatcher is purely routing logic, it should always render its children
    expect(view.children.length).toBe(1);

    expect(view.internal).not.toBe(null);

    view.unmount();

    // After unmounting the interval has been cleared
    expect(view.internal).toBe(undefined);
  });

  it("unauthenticated user is on root", () => {
    history.replace("/login");

    // Initial state user is null, unauthed
    const view = shallow(
      <SessionWatcher
        checkSession={checkSession}
        // No user, the page just loaded
        loaded={["user"]}
      >
        <h1>Hello World</h1>
      </SessionWatcher>
    );

    history.push("/");

    // Request from unauth user  to an authed page
    view.setProps({ user: null });

    // Unauthed user is redirected to the login screen
    expect(history.location.pathname).toEqual(ROUTE_LOGIN);
  });

  it("unauthenticated user is on an authenticated page", () => {
    history.replace("/");

    // Initial state user is null, unauthed
    const view = shallow(
      <SessionWatcher checkSession={checkSession} loaded={[]}>
        <h1>Hello World</h1>
      </SessionWatcher>
    );

    // Request from unauth user  to an authed page
    view.setProps({
      user: null,
    });

    // Unauthed user is redirected to the login screen
    expect(history.location.pathname).toEqual(ROUTE_LOGIN);
  });

  it("authenticated user is on an unauthenticated page", () => {
    history.replace("/login");

    // Initial state user is null, unauthed
    const view = shallow(
      <SessionWatcher checkSession={checkSession}>
        <h1>Hello World</h1>
      </SessionWatcher>
    );

    // A request for the session has been made, but the user is not logged in
    view.setProps({
      loaded: ["user"],
      user: {},
    });

    // Unauthed user is redirected to the login screen
    expect(history.location.pathname).toEqual(ROUTE_ROOT);
  });

  it("user was authenticated and logged out", () => {
    // Initial state user is null, unauthed
    const view = shallow(
      <SessionWatcher checkSession={checkSession} loaded={["user"]} user={{}}>
        <h1>Hello World</h1>
      </SessionWatcher>
    );

    // User gets logged out
    view.setProps({
      user: null,
    });

    // Unauthed user is redirected to the login screen
    expect(history.location.pathname).toEqual(ROUTE_LOGIN);
  });

  it("user is authenticated on an authenticated page - noop", () => {
    history.replace("/page1");

    // Initial state user is null, unauthed
    const view = shallow(
      <SessionWatcher checkSession={checkSession} loaded={["user"]} user={{}}>
        <h1>Hello World</h1>
      </SessionWatcher>
    );

    history.replace("/page2");

    // User gets logged out
    view.setProps({
      user: {},
    });

    // navigateTo() should not be called, so the location should not change
    expect(history.location.pathname).toEqual("/page2");
  });
});
