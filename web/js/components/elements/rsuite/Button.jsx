import React from "react";
import PropTypes from "prop-types";
import omit from "lodash/omit";
import { Button as RsuiteButton } from "rsuite";

export default function Button({
  children,
  size,
  selected: active,
  is,
  width,
  ..._props
}) {
  const style = Object.assign(_props.style || {}, {
    minWidth: width,
  });
  const type = _props.onClick ? "button" : _props.type ?? "submit";
  const props = omit(_props, "style", "children", "is", "size", "width");
  const appearance =
    is === "primary" || is === "danger" ? "primary" : "default";
  const color = is === "danger" ? "red" : null;

  return (
    <RsuiteButton
      type={type}
      active={active}
      appearance={appearance}
      color={color}
      size={convertSize(size)}
      style={style}
      {...props}
    >
      {children}
    </RsuiteButton>
  );
}

function convertSize(size) {
  switch (size) {
    case "large":
      return "lg";
    case "medium":
      return "md";
    case "small":
      return "sm";
    default:
      return "";
  }
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf("small", "large", "medium"),
  selected: PropTypes.bool,
  is: PropTypes.oneOf("default", "primary", "danger"),
  width: PropTypes.oneOf("none", PropTypes.number),
};
