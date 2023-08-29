import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { RegisterView } from "./RegisterView";
import { getCurrentPathname } from "../lib/Navigation";
import {
  ROUTE_LOGIN,
  ROUTE_PRIVACY_POLICY,
  ROUTE_TERMS_OF_SERVICE,
} from "./Routes";

describe("<RegisterView />", () => {
  it("should render a register screen with empty fields", () => {
    render(<RegisterView registerUser={() => {}} clearErrors={() => {}} />);

    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Email")).toHaveValue("");
    expect(screen.getByLabelText("Password")).toHaveValue("");
  });

  it("should render errors when submitted with empty fields", () => {
    render(<RegisterView registerUser={() => {}} clearErrors={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(screen.getByText("You must enter your name.")).toBeInTheDocument();
    expect(screen.getByText("You must enter your email.")).toBeInTheDocument();
    expect(
      screen.getByText("You must enter your password.")
    ).toBeInTheDocument();
  });

  it("should render an error when no name is supplied", () => {
    render(<RegisterView registerUser={() => {}} clearErrors={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(screen.getByText("You must enter your name.")).toBeInTheDocument();
  });

  it("should render an error when an invalid email is entered", () => {
    render(<RegisterView registerUser={() => {}} clearErrors={() => {}} />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: {
        value: "Not a valid email address",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(
      screen.getByText("You must enter a valid email address.")
    ).toBeInTheDocument();
  });

  it("should render an error when a password is too short", () => {
    render(<RegisterView registerUser={() => {}} clearErrors={() => {}} />);

    fireEvent.change(screen.getByLabelText("Password"), {
      target: {
        value: "short",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(
      screen.getByText(
        "Your password must be between 8 and 64 characters in length."
      )
    ).toBeInTheDocument();
  });

  it("should render an error when a password is too long", () => {
    render(<RegisterView registerUser={() => {}} clearErrors={() => {}} />);

    fireEvent.change(screen.getByLabelText("Password"), {
      target: {
        value:
          "superduperreallyreallyreallylongpasswordlikewaytoolongofapasswordofranysaneperson",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(
      screen.getByText(
        "Your password must be between 8 and 64 characters in length."
      )
    ).toBeInTheDocument();
  });

  it("should render an error when a password is not repeated correctly", () => {
    render(<RegisterView registerUser={() => {}} clearErrors={() => {}} />);

    fireEvent.change(screen.getByLabelText("Password"), {
      target: {
        value: "OnePassword123",
      },
    });

    fireEvent.change(screen.getByLabelText("Repeat Password"), {
      target: {
        value: "TwoPassword456",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(
      screen.getByText("Your password does not match.")
    ).toBeInTheDocument();
  });

  it("should submit a valid user", () => {
    let name, email, password;
    const registerUser = (data) => {
      name = data.name;
      email = data.email;
      password = data.password;
    };

    const expectedName = "Stan Lemon";
    const expectedEmail = "stanlemon@users.noreply.github.com";
    const expectedPassword = "p@$$w0rd!";

    render(<RegisterView registerUser={registerUser} clearErrors={() => {}} />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: {
        value: expectedName,
      },
    });

    fireEvent.change(screen.getByLabelText("Email"), {
      target: {
        value: expectedEmail,
      },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: {
        value: expectedPassword,
      },
    });

    fireEvent.change(screen.getByLabelText("Repeat Password"), {
      target: {
        value: expectedPassword,
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(name).toBe(expectedName);
    expect(email).toBe(expectedEmail);
    expect(password).toBe(expectedPassword);
  });

  it("clicking the button to return to the login screen should trigger navigateTo", () => {
    render(<RegisterView registerUser={() => {}} clearErrors={() => {}} />);

    fireEvent.click(screen.getByText("Return to Login"));

    expect(getCurrentPathname()).toBe(ROUTE_LOGIN);
  });

  it("clicking the privacy policy navigates there", () => {
    render(<RegisterView registerUser={() => {}} clearErrors={() => {}} />);

    fireEvent.click(screen.getByText("Privacy Policy"));

    expect(getCurrentPathname()).toBe(ROUTE_PRIVACY_POLICY);
  });

  it("clicking the terms of service navigates there", () => {
    render(<RegisterView registerUser={() => {}} clearErrors={() => {}} />);

    fireEvent.click(screen.getByText("Terms of Service"));

    expect(getCurrentPathname()).toBe(ROUTE_TERMS_OF_SERVICE);
  });
});
