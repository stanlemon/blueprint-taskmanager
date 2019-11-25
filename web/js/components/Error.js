import React from "react";
import PropTypes from "prop-types";

export default function Error(props) {
  const { message } = props;

  return <div className="error notification is-danger">{message}</div>;
}

Error.propTypes = {
  message: PropTypes.string.isRequired,
};
