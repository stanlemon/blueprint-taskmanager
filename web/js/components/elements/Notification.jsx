import { Message } from "rsuite";
import Spacer from "./Spacer";

// eslint-disable-next-line
export default function Notification({ is, children }) {
  return (
    <>
      <Message showIcon header={is[0].toUpperCase() + is.slice(1)} type={is}>
        <p>{children}</p>
      </Message>
      <Spacer />
    </>
  );
}

Notification.defaultProps = {
  is: false,
};
