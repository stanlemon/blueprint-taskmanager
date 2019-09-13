import React from "react";
import { mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { RegisterView } from "./RegisterView";
import { history } from "../lib/navigateTo";
import { ROUTE_LOGIN } from "./Routes";

configure({ adapter: new Adapter() });

describe("<RegisterView />", () => {
  it("should render a register screen with empty fields", () => {
    const view = mount(<RegisterView registerUser={() => {}} />);

    const name = view.find('input[name="name"]');

    expect(name.props().value).toEqual("");

    const email = view.find('input[name="email"]');

    expect(email.props().value).toEqual("");

    const password = view.find('input[name="password"]');

    expect(password.props().value).toEqual("");
  });

  it("should render errors when submitted with empty fields", () => {
    const view = mount(<RegisterView registerUser={() => {}} />);

    view.find("form").simulate("submit");

    expect(view.find(".has-error").length).toBe(3);

    // Within a node with an error, the error messages
    const errors = view.find(".has-error .help-block");

    expect(errors.at(0).text()).toBe("You must enter your name.");
    expect(errors.at(1).text()).toBe("You must enter your email.");
    expect(errors.at(2).text()).toBe("You must enter your password.");
  });

  it("should render an error when an invalid email is entered", () => {
    const view = mount(<RegisterView registerUser={() => {}} />);

    const name = view.find('input[name="name"]');
    name.simulate("change", {
      target: { name: "name", value: "Name" },
    });

    const email = view.find('input[name="email"]');
    email.simulate("change", {
      target: { name: "email", value: "Not a valid email address" },
    });

    const password = view.find('input[name="password"]');
    password.simulate("change", {
      target: { name: "password", value: "p@$$w0rd!" },
    });

    view.find("form").simulate("submit");

    expect(view.find(".has-error").length).toBe(1);

    // Within a node with an error, the error messages
    const errors = view.find(".has-error .help-block");

    expect(errors.at(0).text()).toBe("You must enter a valid email address.");
  });

  it("should render an error when a password is too short", () => {
    const view = mount(<RegisterView registerUser={() => {}} />);

    const name = view.find('input[name="name"]');
    name.simulate("change", {
      target: { name: "name", value: "Name" },
    });

    const email = view.find('input[name="email"]');
    email.simulate("change", {
      target: { name: "email", value: "foo@bar.com" },
    });

    const password = view.find('input[name="password"]');
    password.simulate("change", {
      target: { name: "password", value: "short" },
    });

    view.find("form").simulate("submit");

    expect(view.find(".has-error").length).toBe(1);

    // Within a node with an error, the error messages
    const errors = view.find(".has-error .help-block");

    expect(errors.at(0).text()).toBe(
      "Your password must be between 8 and 64 characters in length."
    );
  });

  it("should render an error when a password is too long", () => {
    const view = mount(<RegisterView registerUser={() => {}} />);

    const name = view.find('input[name="name"]');
    name.simulate("change", {
      target: { name: "name", value: "Name" },
    });

    const email = view.find('input[name="email"]');
    email.simulate("change", {
      target: { name: "email", value: "foo@bar.com" },
    });

    const password = view.find('input[name="password"]');
    password.simulate("change", {
      target: {
        name: "password",
        value:
          "superduperreallyreallyreallylongpasswordlikewaytoolongofapasswordofranysaneperson",
      },
    });

    view.find("form").simulate("submit");

    expect(view.find(".has-error").length).toBe(1);

    // Within a node with an error, the error messages
    const errors = view.find(".has-error .help-block");

    expect(errors.at(0).text()).toBe(
      "Your password must be between 8 and 64 characters in length."
    );
  });

  it("should submit a valid user", () => {
    let name, email, password;
    const registerUser = data => {
      name = data.name;
      email = data.email;
      password = data.password;
    };

    const expectedName = "Stan Lemon";
    const expectedEmail = "stanlemon@users.noreply.github.com";
    const expectedPassword = "p@$$w0rd!";

    const view = mount(<RegisterView registerUser={registerUser} />);

    const nameInput = view.find('input[name="name"]');
    nameInput.simulate("change", {
      target: { name: "name", value: expectedName },
    });

    const emailInput = view.find('input[name="email"]');
    emailInput.simulate("change", {
      target: { name: "email", value: expectedEmail },
    });

    const passwordInput = view.find('input[name="password"]');
    passwordInput.simulate("change", {
      target: {
        name: "password",
        value: expectedPassword,
      },
    });

    view.find("form").simulate("submit");

    expect(view.find(".has-error").length).toBe(0);

    expect(name).toBe(expectedName);
    expect(email).toBe(expectedEmail);
    expect(password).toBe(expectedPassword);
  });

  it("clicking the button to return to the login screen should trigger navigateTo", () => {
    const view = mount(<RegisterView registerUser={() => {}} />);

    const button = view.findWhere(
      n => n.type() === "a" && n.text() === "Return to Login"
    );

    button.simulate("click");

    expect(history.location.pathname).toBe(ROUTE_LOGIN);
  });
});
