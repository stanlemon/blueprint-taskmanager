import React from "react";
import classNames from "classnames";
import omit from "lodash/omit";
import PropTypes from "prop-types";

export function Column(_props) {
  const classes = classNames(
    "column",
    "is-vcentered",
    {
      [`is-${_props.size}`]: _props.size,
      [`is-offset-${_props.offset}`]: _props.offset,
      // Flex is basically the width on mobile, it's optional
      // I don't provide a mobile offset option yet, this is complicated
      //[`col-xs-${_props.flex}`]: _props.flex,
    },
    _props.className
  );
  const props = omit(_props, "className", "size", "offset");

  return (
    <div className={classes} {...props}>
      {props.children}
    </div>
  );
}

Column.propTypes = {
  children: PropTypes.node,
};

export default Column;
