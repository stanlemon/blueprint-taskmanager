import React from "react";
import classNames from "classnames";
import omit from "lodash/omit";

export function Columns(_props) {
  const classes = classNames(
    "columns",
    "is-vcentered",
    {
      "is-gapless": !_props.gutters,
      "is-mobile": _props.flex,
    },
    _props.className
  );
  const props = omit(_props, "className", "gutters", "children");
  return (
    <div className={classes} {...props}>
      {_props.children}
    </div>
  );
}

Columns.defaultProps = {
  gutters: true,
};

export default Columns;
