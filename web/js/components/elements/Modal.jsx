import PropTypes from "prop-types";
import { Modal } from "rsuite";

export default function ({ isActive = false, onClose = () => {}, children }) {
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
