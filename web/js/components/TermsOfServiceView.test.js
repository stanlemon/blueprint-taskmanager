import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TermsOfServiceView from "./TermsOfServiceView";
import { getCurrentPathname } from "../lib/Navigation";
import { ROUTE_REGISTER } from "./Routes";

describe("<TermsOfServiceView />", () => {
  it("should render", () => {
    const view = render(<TermsOfServiceView />);

    // Validate that the main heading is there
    expect(view.getByText("Terms of Service")).toBeInTheDocument();

    const button = view.getByText("Return to Create Account");

    fireEvent.click(button);

    expect(getCurrentPathname()).toBe(ROUTE_REGISTER);
  });
});
