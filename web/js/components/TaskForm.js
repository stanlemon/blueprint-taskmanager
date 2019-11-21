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

  constructor(props) {
    super(props);

    this.nameInputRef = React.createRef();
    this.datePickerRef = React.createRef();
    this.tagsInputRef = React.createRef();
  }

  handleSubmit = async e => {
    e.preventDefault();

    const errors = {};

    if (isEmpty(this.state.data) || isEmpty(this.state.data.name)) {
      errors["name"] = "You must enter a name for this task.";
      // If we add more fields with error states, this won't scale, but for now if this field has an error
      // focus on it immediately so it can be addressed.
      this.nameInputRef.current.focus();
    }

    // If there are any errors, bail
    if (Object.keys(errors).length > 0) {
      this.setState(state => {
        return { ...state, ...{ errors } };
      });
      return;
    }

    // On successful submit, blur our active fields (the ones an enter can trigger a submit)
    this.nameInputRef.current.blur();
    this.tagsInputRef.current.input.input.blur();

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
                  ref={this.nameInputRef}
                  tabIndex="1"
                  id="name"
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
                  id="description"
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
                    ref={this.datePickerRef}
                    tabIndex="3"
                    id="due"
                    name="due"
                    className="form-control"
                    selected={task.due}
                    onChange={this.setDueDate}
                    todayButton="Today"
                    isClearable={true}
                    shouldCloseOnSelect={true}
                    showTimeSelect
                    dateFormat="MM/dd/yyyy h:mma"
                    onKeyDown={e => {
                      // If a date has already been selected, the enter key advanced the focus to the next form field.
                      if (e.keyCode === 13) {
                        // If a date has not been selected on the calendar, do the normal thing
                        if (isEmpty(this.datePickerRef.current.input.value)) {
                          return;
                        }

                        // Close calendar
                        this.datePickerRef.current.setOpen(false);
                        // Focus on the next input, the tags
                        // The ref is to <ReactTags/> which has an <Input/> reference that has a reference to the actual form <input/>
                        this.tagsInputRef.current.input.input.focus();
                      }
                    }}
                  />
                </div>
                {errors.due && <span className="help-block">{errors.due}</span>}
              </label>
            </div>
            {task && task.id && (
              <div className="checkbox">
                <label className="control-label task-completed">
                  <input
                    tabIndex="4"
                    id="completed"
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
                    ref={this.tagsInputRef}
                    inputAttributes={{ tabIndex: 5 }}
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
                tabIndex="6"
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
