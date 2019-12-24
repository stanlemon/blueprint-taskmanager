import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class Modal extends React.Component {
  render() {
    return (
      <div
        className={classNames("modal", { "is-active": this.props.isActive })}
      >
        <div className="modal-background"></div>
        <div className="modal-content">
          <div className="box">
            <div className="content">{this.props.children}</div>
          </div>
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={this.props.onClose}
        ></button>
      </div>
    );
  }
}

Modal.propTypes = {
  isActive: PropTypes.bool,
  onClose: PropTypes.func,
};

Modal.defaultProps = {
  isActive: false,
  onClose: () => {},
};
