import React from "react";
import PropTypes from "prop-types";
import FlexboxGrid from "rsuite/FlexboxGrid";

export function Columns(_props) {
  return <FlexboxGrid align="middle">{_props.children}</FlexboxGrid>;
}

Columns.propTypes = {
  flex: PropTypes.bool,
};

Columns.defaultProps = {
  flex: false,
  gutters: true,
};

export default Columns;
