import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { VerifyEmailView, VerifyEmailViewContainer } from "./VerifyEmailView";
import { ROUTE_LOGIN } from "./Routes";
import { getCurrentPathname } from "../lib/Navigation";

describe("<VerifyEmailView />", () => {
  it("should render verifying while its loading", () => {
    const view = render(<VerifyEmailView />);

    expect(view.getByText("Verifying...")).toBeInTheDocument();
  });

  it("should render a success message", () => {
    const message = "SUCCESS";

    const view = render(
      <VerifyEmailView loaded={true} success={true} message={message} />
    );

    expect(view.queryByText("Verifying...")).not.toBeInTheDocument();
    expect(view.getByText(message)).toBeInTheDocument();
    // Success = true yield success text
    expect(view.getByRole("alert")).toHaveClass("rs-message-success");
  });

  it("should render a failure message", () => {
    const message = "FAILURE";

    const view = render(
      <VerifyEmailView loaded={true} success={false} message={message} />
    );

    expect(view.queryByText("Verifying...")).not.toBeInTheDocument();
    expect(view.getByText(message)).toBeInTheDocument();
    // Success = false yields danger text
    expect(view.getByRole("alert")).toHaveClass("rs-message-error");
  });

  it("should call verify", async () => {
    let isVerified = false;
    const response = { success: true, message: "Verified!" };
    const verify = () => {
      isVerified = true;

      return Promise.resolve(response);
    };

    const view = render(<VerifyEmailViewContainer verify={verify} />);

    await waitFor(() => {
      expect(isVerified).toBe(true);
    });

    const button = view.getByText("Login to Blueprint");

    fireEvent.click(button);

    expect(getCurrentPathname()).toBe(ROUTE_LOGIN);
  });
});
