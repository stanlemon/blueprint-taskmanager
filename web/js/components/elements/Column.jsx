import React from "react";
import PropTypes from "prop-types";
import FlexboxGrid from "rsuite/FlexboxGrid";

export function Column({ children, size = 6 }) {
  return <FlexboxGrid.Item colspan={size}>{children}</FlexboxGrid.Item>;
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
