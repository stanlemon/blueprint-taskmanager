import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { SessionWatcher } from "./SessionWatcher";

configure({ adapter: new Adapter() });

describe("<SessionWatcher />", () => {
    const checkSession = () => {};

    const makeRouterParams = path => ({ location: { pathname: path } });

    it("renders children", () => {
        // Initial state user is null, unauthed
        const view = shallow(
            <SessionWatcher
                history={makeRouterParams("/")}
                navigateTo={r => r}
                checkSession={checkSession}
            >
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
        let destUrl;

        const navigateTo = r => {
            destUrl = r;
        };

        // Initial state user is null, unauthed
        const view = shallow(
            <SessionWatcher
                history={makeRouterParams("/login")}
                navigateTo={navigateTo}
                checkSession={checkSession}
                loaded={["user"]}
                user={null}
            >
                <h1>Hello World</h1>
            </SessionWatcher>
        );

        // Request from unauth user  to an authed page
        view.setProps({
            history: makeRouterParams("/"),
        });

        // Unauthed user is redirected to the login screen
        expect(destUrl).toEqual("/login");
    });

    it("unauthenticated user is on an authenticated page", () => {
        let destUrl;

        const navigateTo = r => {
            destUrl = r;
        };

        // Initial state user is null, unauthed
        const view = shallow(
            <SessionWatcher
                history={makeRouterParams("/login")}
                navigateTo={navigateTo}
                checkSession={checkSession}
                loaded={["user"]}
                user={null}
            >
                <h1>Hello World</h1>
            </SessionWatcher>
        );

        // Request from unauth user  to an authed page
        view.setProps({
            history: makeRouterParams("/page"),
        });

        // Unauthed user is redirected to the login screen
        expect(destUrl).toEqual("/login");
    });

    it("authenticated user is on an unauthenticated page", () => {
        let destUrl;

        const navigateTo = r => {
            destUrl = r;
        };

        // Initial state user is null, unauthed
        const view = shallow(
            <SessionWatcher
                history={makeRouterParams("/login")}
                navigateTo={navigateTo}
                checkSession={checkSession}
            >
                <h1>Hello World</h1>
            </SessionWatcher>
        );

        // A request for the session has been made, but the user is not logged in
        view.setProps({
            loaded: ["user"],
            user: {},
        });

        // Unauthed user is redirected to the login screen
        expect(destUrl).toEqual("/");
    });

    it("user was authenticated and logged out", () => {
        let destUrl;

        const navigateTo = r => {
            destUrl = r;
        };

        // Initial state user is null, unauthed
        const view = shallow(
            <SessionWatcher
                history={makeRouterParams("/page")}
                navigateTo={navigateTo}
                checkSession={checkSession}
                loaded={["user"]}
                user={{}}
            >
                <h1>Hello World</h1>
            </SessionWatcher>
        );

        // User gets logged out
        view.setProps({
            user: null,
        });

        // Unauthed user is redirected to the login screen
        expect(destUrl).toEqual("/login");
    });

    it("user is authenticated on an authenticated page - noop", () => {
        let destUrl;

        const navigateTo = r => {
            destUrl = r;
        };

        // Initial state user is null, unauthed
        const view = shallow(
            <SessionWatcher
                history={makeRouterParams("/page1")}
                navigateTo={navigateTo}
                checkSession={checkSession}
                loaded={["user"]}
                user={{}}
            >
                <h1>Hello World</h1>
            </SessionWatcher>
        );

        // User gets logged out
        view.setProps({
            history: makeRouterParams("/page2"),
            user: {},
        });

        // navigateTo() should not be called, so this should remain undefined
        expect(destUrl).toEqual(undefined);
    });
});
