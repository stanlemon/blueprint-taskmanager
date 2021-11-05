import React from "react";
import classNames from "classnames";
import omit from "lodash/omit";
import PropTypes from "prop-types";

export function Column(_props) {
  const classes = classNames(
    "column",
    "is-vcentered",
    {
      [`is-${_props.mobile}-mobile`]: _props.mobile,
      [`is-${_props.size}-tablet`]: _props.size,
      [`is-offset-${_props.offset}`]: _props.offset,
      "is-narrow": _props.narrow,
    },
    _props.className
  );
  const props = omit(_props, "className", "size", "offset", "narrow");

  return (
    <div className={classes} {...props}>
      {props.children}
    </div>
  );
}

Column.propTypes = {
  children: PropTypes.node,
  size: PropTypes.number,
  mobile: PropTypes.number,
  narrow: PropTypes.bool,
};

Column.defaultProps = {
  narrow: false,
};

export default Column;
