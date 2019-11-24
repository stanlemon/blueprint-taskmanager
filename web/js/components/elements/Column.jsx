import React from "react";
import classNames from "classnames";
import omit from "lodash/omit";

export function Column(_props) {
  const classes = classNames(
    {
      [`col-sm-${_props.size}`]: _props.size,
      [`col-sm-offset-${_props.offset}`]: _props.offset,
      // Flex is basically the width on mobile, it's optional
      // I don't provide a mobile offset option yet, this is complicated
      [`col-xs-${_props.flex}`]: _props.flex,
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

export default Column;
