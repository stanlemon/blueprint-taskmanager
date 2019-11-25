import React from "react";
import omit from "lodash/omit";

export function Container(_props) {
  const props = omit(_props, "children");
  return <div {...props}>{_props.children}</div>;
}

export default Container;
