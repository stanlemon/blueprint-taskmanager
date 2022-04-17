import React from "react";
import PropTypes from "prop-types";
import { Notification } from "./elements";

export default function Error({ message }) {
  return <Notification is="error">{message}</Notification>;
}

Error.propTypes = {
  message: PropTypes.string.isRequired,
};
