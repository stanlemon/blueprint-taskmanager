import React from "react";
import { render, fireEvent } from "@testing-library/react";
import PrivacyPolciyView from "./PrivacyPolicyView";
import { getCurrentPathname } from "../lib/Navigation";
import { ROUTE_REGISTER } from "./Routes";

describe("<PrivacyPolciyView />", () => {
  it("should render", () => {
    const view = render(<PrivacyPolciyView />);

    // Validate that the main heading is there
    expect(view.getByText("Privacy Policy")).toBeInTheDocument();

    const button = view.getByText("Return to Create Account");

    fireEvent.click(button);

    expect(getCurrentPathname()).toBe(ROUTE_REGISTER);
  });
});
