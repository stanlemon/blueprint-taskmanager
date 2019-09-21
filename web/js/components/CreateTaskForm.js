import React from "react";
import PropTypes from "prop-types";
import TaskForm from "./TaskForm";
import { connect } from "react-redux";
import { createTask } from "../actions";

export class CreateTaskForm extends React.Component {
  static propTypes = {
    createTask: PropTypes.func.isRequired,
    errors: PropTypes.object,
    tags: PropTypes.arrayOf(PropTypes.string),
  };

  constructor(props) {
    super(props);
  }

  handleSave = async data => {
    const response = await this.props.createTask(data);

    if (response.errors) {
      return data;
    }

    // Return a blank task
    return Object.assign({}, TaskForm.defaultProps.task);
  };

  render() {
    return (
      <TaskForm
        className="task-create-form"
        onSubmit={this.handleSave}
        tags={this.props.tags}
        errors={this.props.errors}
      />
    );
  }
}

export default connect(
  state => ({ tags: state.tags, errors: state.errors }),
  { createTask }
)(CreateTaskForm);
