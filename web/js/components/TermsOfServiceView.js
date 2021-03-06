import React from "react";
import TermsOfService from "./TermsOfService";
import { navigateTo } from "../lib/Navigation";
import { ROUTE_REGISTER } from "./Routes";

export default function TermsOfServiceView() {
  return (
    <div className="container" style={{ marginTop: "-2rem", maxWidth: 900 }}>
      <div className="content" style={{ padding: 20 }}>
        <TermsOfService />
      </div>
      <div className="has-text-centered" style={{ marginBottom: "2rem" }}>
        <a className="is-link" onClick={() => navigateTo(ROUTE_REGISTER)}>
          Return to Create Account
        </a>
      </div>
    </div>
  );
}
