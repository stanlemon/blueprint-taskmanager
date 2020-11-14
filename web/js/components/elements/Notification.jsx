import React from "react";
import classNames from "classnames";
import omit from "lodash/omit";

export function Notification(_props) {
  const classes = classNames(
    "notification",
    {
      [`is-${_props.is}`]: _props.is,
    },
    _props.className
  );
  const { children } = _props;
  const props = omit(_props, "className", "children", "is");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

Notification.defaultProps = {
  is: false,
};

export default Notification;
