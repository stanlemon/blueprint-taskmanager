import PropTypes from "prop-types";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { Form, Input, InputGroup } from "rsuite";

export default function Field({
  name,
  type = "text",
  label,
  value,
  placeholder,
  onChange = () => {},
  required,
  icon,
  error,
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <Form.ControlLabel htmlFor={name} required={required}>
        {label}
      </Form.ControlLabel>
      <InputGroup>
        <Input
          as={type === "textarea" ? "textarea" : "input"}
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
        {icon && (
          <InputGroup.Addon>
            <Icon icon={icon} />
          </InputGroup.Addon>
        )}
      </InputGroup>

      {required && <Form.HelpText tooltip>Required</Form.HelpText>}

      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

Field.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  icon: PropTypes.any,
  error: PropTypes.string,
};
