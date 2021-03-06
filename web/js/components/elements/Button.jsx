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
  const style = Object.assign(_props.style || {}, {
    minWidth: _props.width,
  });
  const props = omit(
    _props,
    "className",
    "style",
    "children",
    "is",
    "size",
    "width"
  );

  return (
    <button className={classes} style={style} {...props}>
      {children}
    </button>
  );
}

Button.defaultProps = {
  is: "default",
  size: "normal",
  width: 110,
};

export default Button;
