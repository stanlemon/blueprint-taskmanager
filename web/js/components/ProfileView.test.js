import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ProfileView } from "./ProfileView";
import waitForExpect from "wait-for-expect";

describe("<ProfileView />", () => {
  it("should render and submit changes", () => {
    let savedUser;

    const saveUser = data => (savedUser = data);

    const user = { name: "Test", email: "test@test.com" };
    const newName = "New Test";
    const newEmail = "newtest@newtest.com";

    const view = render(<ProfileView user={user} saveUser={saveUser} />);

    expect(view.getByText("Profile")).toBeInTheDocument();

    const name = view.getByLabelText("Name");
    expect(name.value).toEqual(user.name);

    const email = view.getByLabelText("Email");
    expect(email.value).toEqual(user.email);

    const password = view.getByLabelText("Password");
    expect(password.value).toEqual("");

    const repeatPassword = view.getByLabelText("Repeat Password");
    expect(repeatPassword.value).toEqual("");

    fireEvent.change(name, {
      target: {
        name: "name",
        value: newName,
      },
    });

    fireEvent.change(name, {
      target: {
        name: "email",
        value: newEmail,
      },
    });

    expect(name.value).toEqual(newName);
    expect(email.value).toEqual(newEmail);

    const saveButton = view.getByText("Save");

    fireEvent.click(saveButton);

    expect(savedUser).toMatchObject({ name: newName, email: newEmail });
  });

  it("should validate and catch errors", () => {
    const saveUser = () => {};

    const user = { name: "Test", email: "notavalidemailaddress" };

    const view = render(<ProfileView user={user} saveUser={saveUser} />);

    expect(view.getByText("Profile")).toBeInTheDocument();

    const saveButton = view.getByText("Save");

    fireEvent.click(saveButton);

    // <UserForm /> contains validation and we want to make sure it bubbles up
    waitForExpect(() => {
      expect(
        view.getByText("You must enter a valid email address.")
      ).toBeInTheDocument();
    });
  });
});
