import React from "react";
import classNames from "classnames";
import omit from "lodash/omit";

export function Container(_props) {
  const classes = classNames("container", _props.className);
  const props = omit(_props, "className", "children");
  return (
    <div className={classes} {...props}>
      {_props.children}
    </div>
  );
}

export default Container;
