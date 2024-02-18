import PropTypes from "prop-types";
import FlexboxGrid from "rsuite/FlexboxGrid";

export function Column({ children, size = 6, ...props }) {
  return (
    <FlexboxGrid.Item colspan={size} {...props}>
      {children}
    </FlexboxGrid.Item>
  );
}

Column.propTypes = {
  children: PropTypes.node,
  size: PropTypes.number,
};

export default Column;
