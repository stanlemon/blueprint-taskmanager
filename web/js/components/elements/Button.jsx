import PropTypes from "prop-types";
import omit from "lodash/omit";
import { Button as RsuiteButton } from "rsuite";

export default function Button({
  children,
  selected: active,
  is,
  width,
  ..._props
}) {
  const style = Object.assign(_props.style || {}, {
    minWidth: width,
  });
  const type = _props.onClick ? "button" : (_props.type ?? "submit");
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
      style={style}
      {...props}
    >
      {children}
    </RsuiteButton>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  selected: PropTypes.bool,
  is: PropTypes.oneOf(["default", "primary", "danger"]),
  width: PropTypes.oneOf(["none", PropTypes.number]),
};
