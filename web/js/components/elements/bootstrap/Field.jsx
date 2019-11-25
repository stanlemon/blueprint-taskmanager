import React from "react";
import classNames from "classnames";
import omit from "lodash/omit";
import PropTypes from "prop-types";

const Field = React.forwardRef((props, ref) => {
  const input = makeInput(props, ref);

  const icon = (
    <span className="input-group-addon">
      <i className={classNames("fa", `fa-${props.icon}`)} />
    </span>
  );

  if (props.isHorizontal) {
    return (
      <div
        className={classNames("form-group", {
          "has-error": props.error,
        })}
      >
        <label htmlFor={props.name}>
          <div className="col-sm-3 control-label">{props.label}</div>
          <div className="col-sm-9">
            {props.icon && (
              <div className="input-group">
                {icon}
                {input}
              </div>
            )}
            {!props.icon && input}
            {props.error && <span className="help-block">{props.error}</span>}
          </div>
        </label>
      </div>
    );
  }

  // Non-horizontal fields with checkboxes show the label after instead of before the input
  const children =
    props.type === "checkbox" ? (
      <>
        {input} {props.label}
      </>
    ) : (
      <>
        {props.label} {input}
      </>
    );

  return (
    <div
      className={classNames("form-group", {
        "has-error": props.error,
      })}
    >
      <label htmlFor={props.name} className="control-label">
        {children}
        {props.error && <span className="help-block">{props.error}</span>}
      </label>
    </div>
  );
});

function makeInput(_props, ref) {
  const { name, type, value, children } = _props;
  const id = _props.id ? _props.id : name;
  const classes = classNames(
    { checkbox: type !== "checkbox" },
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
  icon: PropTypes.string,
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
