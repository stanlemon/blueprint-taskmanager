import React from "react";
import PropTypes from "prop-types";
import { Notification } from "./elements/Notification";

export default function Error(props) {
  const { message } = props;

  return (
    <Notification is="danger" className="error">
      {message}
    </Notification>
  );
}

Error.propTypes = {
  message: PropTypes.string.isRequired,
};
