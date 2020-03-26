import React from "react";
import { mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { history } from "../lib/Navigation";
import { LoginView } from "./LoginView";
import Error from "./Error";
import { ROUTE_REGISTER } from "./Routes";

configure({ adapter: new Adapter() });

describe("<LoginView />", () => {
  it("should render a login screen with empty fields", () => {
    const view = mount(<LoginView login={() => {}} clearErrors={() => {}} />);

    const username = view.find('input[name="username"]');

    expect(username.props().value).toEqual("");

    const password = view.find('input[name="password"]');

    expect(password.props().value).toEqual("");
  });

  it("should error when fields are submitted blank", () => {
    const view = mount(<LoginView login={() => {}} clearErrors={() => {}} />);

    view.find("form").simulate("submit");

    view.update();

    const errors = view.find(".error");

    expect(errors.length).toBe(2);

    expect(errors.at(0).text()).toBe("You must enter your username.");
    expect(errors.at(1).text()).toBe("You must enter your password.");
  });

  it("should submit a username and password", () => {
    let username, password;
    const login = (data) => {
      username = data.username;
      password = data.password;
    };
    const view = mount(<LoginView login={login} clearErrors={() => {}} />);

    const expectedUsername = "test@test.com";
    const expectedPassword = "p@$$w0rd";

    const usernameInput = view.find('input[name="username"]');
    usernameInput.simulate("change", {
      target: { name: "username", value: expectedUsername },
    });

    const passwordInput = view.find('input[name="password"]');
    passwordInput.simulate("change", {
      target: { name: "password", value: expectedPassword },
    });

    view.find("form").simulate("submit");

    expect(view.find(".error").length).toBe(0);

    expect(username).toBe(expectedUsername);
    expect(password).toBe(expectedPassword);
  });

  it("clicking the button to go to the register screen should trigger navigateTo", () => {
    const view = mount(<LoginView login={() => {}} clearErrors={() => {}} />);

    const button = view.findWhere(
      (n) => n.type() === "a" && n.text() === "Create Account"
    );

    button.simulate("click");

    expect(history.location.pathname).toBe(ROUTE_REGISTER);
  });

  it("errors from actions render", () => {
    const view = mount(
      <LoginView
        login={() => {}}
        errors={{ main: "Error message" }}
        clearErrors={() => {}}
      />
    );

    expect(view.find(Error).length).toBe(1);
  });
});
