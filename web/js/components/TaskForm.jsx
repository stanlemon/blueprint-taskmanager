import isBoolean from "lodash/isBoolean";
import { format } from "date-fns";
import React from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import isFunction from "lodash/isFunction";
import { Checkbox, DatePicker, Form, TagInput } from "rsuite";
import { navigateTo } from "../lib/Navigation";
import { DATE_FORMAT_LONG } from "../lib/Utils";
import { Field, Button, Spacer } from "./elements/";
import { ROUTE_ROOT } from "./Routes";

export default class TaskForm extends React.Component {
  // Doing it this way ensure that if a task is loaded we default to it,
  // without blowing away the state on any component reload
  // See: https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
  state = {
    data: {
      id: this.props.task.id || null,
      name: this.props.task.name || "",
      description: this.props.task.description || "",
      completed: this.props.task.completed || null,
      due: this.props.task.due || null,
      tags: this.props.task.tags || [],
    },
    errors: {},
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (isEmpty(this.state.data) || isEmpty(this.state.data.name)) {
      errors["name"] = "You must enter a name for this task.";
    }

    // If there are any errors, bail
    if (Object.keys(errors).length > 0) {
      this.setState((state) => {
        return { ...state, ...{ errors } };
      });
      return;
    }

    const result = await this.props.onSubmit(this.state.data);

    // The onSubmit can also return a callback, but in that event we don't update state, but allow
    // the callback to provide state to update, if it wants
    if (isFunction(result)) {
      result((state) => {
        this.setState(state);
      });
      return;
    }

    this.setState({ errors: {}, data: result });
  };

  cancelTask = (e) => {
    e.preventDefault();

    navigateTo(ROUTE_ROOT);
  };

  setCompleted = (value, checked) => {
    if (checked) {
      this.setData("completed", Date.now());
    } else {
      this.setData("completed", null);
    }
  };

  setDueDate = (due) => {
    this.setData("due", due);
  };

  setData = (key, value) => {
    this.setState((state) => {
      return {
        ...state,
        ...{
          data: { ...state.data, ...{ [key]: value } },
        },
      };
    });
  };

  setTags = (tags) => {
    this.setData("tags", tags);
  };

  setValue = (value, e) => {
    if (e.target.type && e.target.type === "checkbox") {
      this.setData(e.target.name, e.target.checked);
    } else {
      this.setData(e.target.name, e.target.value);
    }
  };

  render() {
    const task = this.state.data;
    const errors = Object.assign({}, this.state.errors, this.props.errors);

    return (
      <form id={this.props.id} onSubmit={this.handleSubmit}>
        <Field
          label="Name"
          name="name"
          error={errors.name}
          onChange={this.setValue}
          value={task.name}
        />
        <Field
          label="Description"
          name="description"
          type="textarea"
          error={errors.description}
          onChange={this.setValue}
          value={task.description}
        />

        <div style={{ marginBottom: 20 }}>
          <Form.ControlLabel htmlFor="due">Due</Form.ControlLabel>
          <DatePicker
            name="due"
            id="due"
            block
            format="MM/dd/yyyy hh:mmaa"
            showMeridian={true}
            ranges={[
              {
                label: "today",
                value: new Date(),
              },
            ]}
            value={task.due}
            onChange={this.setDueDate}
          />
          {errors.due && <div style={{ color: "red" }}>{errors.due}</div>}
        </div>

        <div style={{ marginBottom: 20 }}>
          <Form.ControlLabel>Tags</Form.ControlLabel>
          <TagInput block value={task.tags} onChange={this.setTags} />
          {errors.tags && <div style={{ color: "red" }}>{errors.tags}</div>}
        </div>

        <Checkbox
          name="completed"
          checked={task.completed ? true : false}
          onChange={this.setCompleted}
        >
          Completed
          {task && task.id && task.completed && !isBoolean(task.completed) && (
            <em> on {format(task.completed, DATE_FORMAT_LONG)}</em>
          )}
        </Checkbox>

        <Spacer />

        <div>
          <Button
            id="save-task"
            type="submit"
            is="primary"
            onClick={this.handleSubmit}
          >
            Save
          </Button>
          {task.id && (
            <Button id="cancel-task" onClick={this.cancelTask}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    );
  }
}

TaskForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  task: PropTypes.object,
  errors: PropTypes.object,
  id: PropTypes.string.isRequired,
};

TaskForm.defaultProps = {
  errors: {},
  tags: [],
  task: {
    name: "",
    description: "",
    completed: null,
    due: null,
    tags: [],
  },
};
