import React from "react";
import PropTypes from "prop-types";
import TaskForm from "./TaskForm";
import { connect } from "react-redux";
import { createTask } from "../actions";

export class CreateTaskForm extends React.Component {
  handleSave = async (data) => {
    const response = await this.props.createTask(data);

    // If there was an error, return the data we submitted, because <TaskForm/> will repopulate it
    if (response && response.errors) {
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

CreateTaskForm.propTypes = {
  createTask: PropTypes.func.isRequired,
  errors: PropTypes.object,
  tags: PropTypes.arrayOf(PropTypes.string),
};

/* istanbul ignore next */
export default connect(({ tags, errors }) => ({ tags, errors }), {
  createTask,
})(CreateTaskForm);
