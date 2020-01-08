import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { VerifyEmailView } from "./VerifyEmailView";

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

    expect(view.queryByText("Verifying...")).toBe(null);
    expect(view.getByText(message)).toBeInTheDocument();
    // Success = true yield success text
    expect(view.getByText(message).classList.contains("has-text-success")).toBe(
      true
    );
  });

  it("should render a failure message", () => {
    const message = "FAILURE";

    const view = render(
      <VerifyEmailView loaded={true} success={false} message={message} />
    );

    expect(view.queryByText("Verifying...")).toBe(null);
    expect(view.getByText(message)).toBeInTheDocument();
    // Success = false yields danger text
    expect(view.getByText(message).classList.contains("has-text-danger")).toBe(
      true
    );
  });
});
