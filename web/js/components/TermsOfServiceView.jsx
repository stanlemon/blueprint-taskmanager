import TermsOfService from "./TermsOfService";
import { navigateTo } from "../lib/Navigation";
import { ROUTE_REGISTER } from "./Routes";
import { Button, Center, Container, Spacer } from "./elements";

export default function TermsOfServiceView() {
  return (
    <Container>
      <TermsOfService />
      <Spacer />
      <Center>
        <Button onClick={() => navigateTo(ROUTE_REGISTER)}>
          Return to Create Account
        </Button>
      </Center>
    </Container>
  );
}
