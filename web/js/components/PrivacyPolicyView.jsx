import React from "react";
import PrivacyPolciy from "./PrivacyPolicy";
import { navigateTo } from "../lib/Navigation";
import { ROUTE_REGISTER } from "./Routes";
import { Container } from "./elements";

export default function PrivacyPolciyView() {
  return (
    <Container style={{ marginTop: "-2rem", maxWidth: 900 }}>
      <div className="content" style={{ padding: 20 }}>
        <PrivacyPolciy />
      </div>
      <div className="has-text-centered" style={{ marginBottom: "2rem" }}>
        <a className="is-link" onClick={() => navigateTo(ROUTE_REGISTER)}>
          Return to Create Account
        </a>
      </div>
    </Container>
  );
}
