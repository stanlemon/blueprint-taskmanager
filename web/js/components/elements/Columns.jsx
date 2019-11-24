import React from "react";
import classNames from "classnames";
import omit from "lodash/omit";

export function Columns(_props) {
  const classes = classNames(
    "row",
    { "row-no-gutters": !_props.gutters },
    _props.className
  );
  const props = omit(_props, "className", "gutters", "children");
  return (
    <>
      <div className={classes} {...props}>
        {_props.children}
      </div>
      <div className="clearfix"></div>
    </>
  );
}

Columns.defaultProps = {
  gutters: true,
};

export default Columns;
