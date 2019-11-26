import React from "react";
import classNames from "classnames";
import omit from "lodash/omit";

export function Button(_props) {
  const classes = classNames(
    "button",
    {
      [`is-${_props.is}`]: _props.is,
      [`is-${_props.size}`]: _props.size,
      "is-selected": _props.selected,
    },
    _props.className
  );
  const { children } = _props;
  const props = omit(_props, "className", "children", "is", "size");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

Button.defaultProps = {
  is: "default",
};

export default Button;
