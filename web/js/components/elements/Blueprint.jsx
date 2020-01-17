import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default function Blueprint({ size = 5 }) {
  return (
    <h1 className={classNames("title has-text-info", "is-" + size)}>
      Blueprint Task Manager
    </h1>
  );
}

Blueprint.propTypes = {
  size: PropTypes.number,
};
