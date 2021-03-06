import React from "react";
import classNames from "classnames";
import omit from "lodash/omit";
import PropTypes from "prop-types";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";

// In the future handle <select> and <input type="radio" />
const Field = React.forwardRef((props, ref) => {
  const input = makeInput(props, ref);

  if (props.isHorizontal) {
    return (
      <div className={classNames("field", "is-horizontal")}>
        <div className="field-label is-normal">
          <label className="label" htmlFor={props.name}>
            {props.label}
          </label>
        </div>
        <div className="field-body">
          <div className="field">
            {props.icon && (
              <p className="control is-expanded has-icons-left">
                {input}
                <span className="icon is-small is-left">
                  <Icon icon={props.icon} />
                </span>
              </p>
            )}
            {!props.icon && <div className="control">{input}</div>}
            {props.error && (
              <p className="error help is-danger">{props.error}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  let icon = "";
  if (props.icon) {
    icon = (
      <span className="icon is-small is-left">
        <Icon icon={props.icon} />
      </span>
    );
  }

  // Non-horizontal fields with checkboxes show the label after instead of before the input
  const children =
    props.type === "checkbox" ? (
      <>
        {props.icon && icon}
        {input} {props.label}
      </>
    ) : (
      <>
        {props.icon && icon}
        {props.label} {input}
      </>
    );

  return (
    <div
      className={classNames("field", {
        "is-danger": props.error,
      })}
    >
      <label
        htmlFor={props.name}
        className={classNames({
          label: props.type !== "checkbox",
          checkbox: props.type === "checkbox",
        })}
      >
        {children}
        {props.error && <p className="error help is-danger">{props.error}</p>}
      </label>
    </div>
  );
});

function makeInput(_props, ref) {
  const { name, type, value, children } = _props;
  const id = _props.id ? _props.id : name;
  const classes = classNames(
    {
      "is-danger": _props.error,
      input: type !== "checkbox" && type !== "textarea",
      textarea: type === "textarea",
    },
    _props.classNames
  );

  const props = omit(
    _props,
    "classNames",
    "name",
    "type",
    "value",
    "icon",
    "isHorizontal",
    "label",
    "error",
    "children"
  );

  if (React.isValidElement(children)) {
    return children;
  }

  if (type === "textarea") {
    return (
      <textarea
        id={id}
        name={name}
        value={value}
        className={classes}
        ref={ref}
        {...props}
      />
    );
  }

  return (
    <input
      id={id}
      name={name}
      className={classes}
      type={type}
      value={value}
      ref={ref}
      {...props}
    />
  );
}

Field.displayName = "Field";

Field.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  isHorizontal: PropTypes.bool,
  onChange: PropTypes.func,
  icon: PropTypes.any,
  error: PropTypes.string,
};

Field.defaultProps = {
  type: "text",
  isHorizontal: false,
  onChange: () => {},
  icon: null,
  error: null,
};

export default Field;
