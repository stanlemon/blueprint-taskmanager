import isBoolean from "lodash/isBoolean";
import classNames from "classnames";
import format from "date-fns/format";
import React from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import isEmpty from "lodash/isEmpty";
import isFunction from "lodash/isFunction";
import uniq from "lodash/uniq";
import Tags from "react-tag-autocomplete";
import { navigateTo } from "../lib/Navigation";
import { DATE_FORMAT_LONG } from "../lib/Utils";

export default class TaskForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    task: PropTypes.object,
    errors: PropTypes.object,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: "",
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

  handleSubmit = async e => {
    e.preventDefault();

    const errors = {};

    if (isEmpty(this.state.data) || isEmpty(this.state.data.name)) {
      errors["name"] = "You must enter a name for this task.";
    }

    // If there are any errors, bail
    if (Object.keys(errors).length > 0) {
      this.setState(state => {
        return { ...state, ...{ errors } };
      });
      return;
    }

    const result = await this.props.onSubmit(this.state.data);

    // The onSubmit can also return a callback, but in that event we don't update state, but allow
    // the callback to provide state to update, if it wants
    if (isFunction(result)) {
      result(state => {
        this.setState(state);
      });
      return;
    }

    this.setState({ errors: {}, data: result });
  };

  cancelTask = e => {
    e.preventDefault();

    navigateTo("/");
  };

  setCompleted = e => {
    if (e.target.checked) {
      this.setData("completed", Date.now());
    } else {
      this.setData("completed", null);
    }
  };

  setDueDate = due => {
    this.setData("due", due);
  };

  setData = (key, value) => {
    this.setState(state => {
      return {
        ...state,
        ...{
          data: { ...state.data, ...{ [key]: value } },
        },
      };
    });
  };

  addTag = tag => {
    this.setData(
      "tags",
      // We flip these before uniquing them to ensure the latest is retained
      uniq([...this.state.data.tags, tag.name].reverse()).reverse()
    );
  };

  removeTag = index => {
    this.setData(
      "tags",
      [...this.state.data.tags].filter((e, i) => i !== index)
    );
  };

  setValue = e => {
    if (e.target.type && e.target.type === "checkbox") {
      this.setData(e.target.name, e.target.checked);
    } else {
      this.setData(e.target.name, e.target.value);
    }
  };

  render() {
    const task = this.state.data;
    const errors = Object.assign({}, this.state.errors, this.props.errors);

    const classes = classNames("task-form", {
      [this.props.className]: !isEmpty(this.props.className),
    });

    return (
      <form className={classes} onSubmit={this.handleSubmit}>
        <div className="well">
          <div>
            <div
              className={classNames("form-group", {
                "has-error": errors.name,
              })}
            >
              <label htmlFor="name" className="control-label">
                Name
                <input
                  tabIndex="1"
                  name="name"
                  type="text"
                  className="form-control"
                  onChange={this.setValue}
                  value={task.name}
                />
                {errors.name && (
                  <span className="help-block">{errors.name}</span>
                )}
              </label>
            </div>
            <div
              className={classNames("form-group", {
                "has-error": errors.description,
              })}
            >
              <label htmlFor="description" className="control-label">
                Description
                <textarea
                  tabIndex="2"
                  name="description"
                  className="form-control"
                  onChange={this.setValue}
                  value={task.description}
                />
                {errors.description && (
                  <span className="help-block">{errors.description}</span>
                )}
              </label>
            </div>
            <div
              className={classNames("form-group", {
                "has-error": errors.due,
              })}
            >
              <label htmlFor="due" className="control-label">
                Due
                <div>
                  <DatePicker
                    tabIndex="3"
                    name="due"
                    className="form-control"
                    selected={task.due}
                    onChange={this.setDueDate}
                    isClearable={true}
                    showTimeSelect
                    dateFormat="MM/dd/yyyy h:mma"
                  />
                </div>
                {errors.due && <span className="help-block">{errors.due}</span>}
              </label>
            </div>
            {task && task.id && (
              <div className="checkbox">
                <label className="control-label task-completed">
                  <input
                    name="completed"
                    type="checkbox"
                    checked={task.completed ? true : false}
                    onChange={this.setCompleted}
                  />
                  Completed
                  {task.completed && !isBoolean(task.completed) && (
                    <em> on {format(task.completed, DATE_FORMAT_LONG)}</em>
                  )}
                </label>
              </div>
            )}
            <div className="form-group">
              <label htmlFor="due" className="control-label">
                Tags
                <div>
                  <Tags
                    inputAttributes={{ tabIndex: 4 }}
                    autofocus={false}
                    delimiterChars={[","]}
                    tags={task.tags.map(t => ({ name: t }))}
                    allowNew={true}
                    suggestions={this.props.tags.map(tag => ({
                      name: tag,
                    }))}
                    handleDelete={this.removeTag}
                    handleAddition={this.addTag}
                  />
                </div>
              </label>
            </div>
            <div className="form-group">
              <button
                // Note to self: This is a mac specific thing is 'All Controls' is selected under Keyboard settings
                tabIndex="5"
                type="submit"
                className="btn btn-primary col-sm-2 save-task"
                onClick={this.handleSubmit}
              >
                Save
              </button>
              {task.id && (
                <a
                  style={{ marginLeft: 20 }}
                  className="btn btn-default col-sm-2 cancel-task"
                  onClick={this.cancelTask}
                >
                  Cancel
                </a>
              )}
            </div>
            <div className="clearfix" />
          </div>
        </div>
      </form>
    );
  }
}
