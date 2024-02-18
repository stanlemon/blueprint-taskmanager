import PropTypes from "prop-types";
import { Modal } from "rsuite";

// eslint-disable-next-line
export default function ({ isActive, onClose, children }) {
  return (
    <Modal open={isActive} onClose={onClose}>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
}

Modal.propTypes = {
  children: PropTypes.node,
  isActive: PropTypes.bool,
  onClose: PropTypes.func,
};

Modal.defaultProps = {
  isActive: false,
  onClose: () => {},
};
