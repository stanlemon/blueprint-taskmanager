import React from "react";
import classNames from "classnames";
import omit from "lodash/omit";
import { Button } from "rsuite";

export function Button(_props) {
  return <Button>{children}</Button>;
}

Button.defaultProps = {
  is: "default",
  size: "normal",
  width: 110,
};

export default Button;
