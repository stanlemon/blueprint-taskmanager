import PropTypes from "prop-types";
import { ButtonGroup as RsuiteButtonGroup } from "rsuite";

export default function ButtonGroup({ children, ...props }) {
  return (
    <RsuiteButtonGroup justified {...props}>
      {children}
    </RsuiteButtonGroup>
  );
}

ButtonGroup.propTypes = {
  children: PropTypes.node.isRequired,
};
