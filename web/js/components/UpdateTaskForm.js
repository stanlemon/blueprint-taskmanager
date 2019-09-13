import React from "react";
import PropTypes from "prop-types";
import TaskForm from "./TaskForm";
import { connect } from "react-redux";
import { navigateTo } from "../lib/Navigation";
import { updateTask } from "../actions";

export class UpdateTaskForm extends React.Component {
  handleSave = data => {
    this.props.updateTask(data);
    navigateTo("/");
    return data;
  };

  render() {
    return (
      <TaskForm
        className="task-update-form"
        task={this.props.task}
        errors={this.props.errors}
        onSubmit={this.handleSave}
      />
    );
  }
}

UpdateTaskForm.propTypes = {
  updateTask: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
  errors: PropTypes.object,
};

export default connect(
  state => ({ errors: state.errors }),
  { updateTask }
)(UpdateTaskForm);
