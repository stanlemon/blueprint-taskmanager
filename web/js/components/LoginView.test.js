import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { getCurrentPathname } from "../lib/Navigation";
import { LoginView } from "./LoginView";
import { ROUTE_REGISTER } from "./Routes";

describe("<LoginView />", () => {
  it("should render a login screen with empty fields", () => {
    render(<LoginView login={() => {}} clearErrors={() => {}} />);

    expect(screen.getByLabelText("Email")).toHaveValue("");
    expect(screen.getByLabelText("Password")).toHaveValue("");
  });

  it("should error when fields are submitted blank", () => {
    render(<LoginView login={() => {}} clearErrors={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(
      screen.getByText("You must enter your username.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("You must enter your password.")
    ).toBeInTheDocument();
  });

  it("should submit a username and password", () => {
    let username, password;
    const login = (data) => {
      username = data.username;
      password = data.password;
    };

    render(<LoginView login={login} clearErrors={() => {}} />);

    const expectedUsername = "test@test.com";
    const expectedPassword = "p@$$w0rd";

    const usernameField = screen.getByLabelText("Email");

    fireEvent.change(usernameField, {
      target: {
        value: expectedUsername,
      },
    });

    expect(usernameField).toHaveValue(expectedUsername);

    const passwordField = screen.getByLabelText("Password");

    fireEvent.change(passwordField, {
      target: {
        value: expectedPassword,
      },
    });

    expect(passwordField).toHaveValue(expectedPassword);

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(username).toBe(expectedUsername);
    expect(password).toBe(expectedPassword);
  });

  it("clicking the button to go to the register screen should trigger navigateTo", () => {
    render(<LoginView login={() => {}} clearErrors={() => {}} />);

    fireEvent.click(screen.getByText("Create Account"));

    expect(getCurrentPathname()).toBe(ROUTE_REGISTER);
  });

  it("errors from actions render", () => {
    const errorMessage = "Error message " + Date.now();

    render(
      <LoginView
        login={() => {}}
        errors={{ main: errorMessage }}
        clearErrors={() => {}}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
