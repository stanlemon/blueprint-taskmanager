import React from "react";
import PropTypes from "prop-types";
import TaskForm from "./TaskForm";

export default class UpdateTaskForm extends React.Component {
  handleSave = data => {
    this.props.actions.updateTask(data);
    this.props.navigateTo("/");
    return data;
  };

  render() {
    return (
      <TaskForm
        className="task-update-form"
        navigateTo={this.props.navigateTo}
        actions={this.props.actions}
        task={this.props.task}
        errors={this.props.errors}
        save={this.handleSave}
      />
    );
  }
}

UpdateTaskForm.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
  task: PropTypes.object.isRequired,
  errors: PropTypes.object,
};
