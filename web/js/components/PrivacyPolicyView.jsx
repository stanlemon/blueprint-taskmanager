import React from "react";
import PrivacyPolciy from "./PrivacyPolicy";
import { navigateTo } from "../lib/Navigation";
import { ROUTE_REGISTER } from "./Routes";
import { Button, Center, Container, Spacer } from "./elements";

export default function PrivacyPolciyView() {
  return (
    <Container>
      <PrivacyPolciy />
      <Spacer />
      <Center>
        <Button onClick={() => navigateTo(ROUTE_REGISTER)}>
          Return to Create Account
        </Button>
      </Center>
    </Container>
  );
}
