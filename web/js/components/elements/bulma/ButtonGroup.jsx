import React from "react";
import PropTypes from "prop-types";

export default function ButtonGroup({ children, ...props }) {
  return (
    <div className="buttons has-addons is-centered" {...props}>
      {children}
    </div>
  );
}

ButtonGroup.propTypes = {
  children: PropTypes.node.isRequired,
};
