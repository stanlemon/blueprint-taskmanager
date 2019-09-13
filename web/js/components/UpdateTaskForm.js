import React from "react";
import PropTypes from "prop-types";
import TaskForm from "./TaskForm";
import { connect } from "react-redux";
import { updateTask } from "../actions";

export class UpdateTaskForm extends React.Component {
  handleSave = data => {
    this.props.updateTask(data);
    this.props.navigateTo("/");
    return data;
  };

  render() {
    return (
      <TaskForm
        className="task-update-form"
        navigateTo={this.props.navigateTo}
        task={this.props.task}
        errors={this.props.errors}
        save={this.handleSave}
      />
    );
  }
}

UpdateTaskForm.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
  errors: PropTypes.object,
};

export default connect(
  state => ({ errors: state.errors }),
  { updateTask }
)(UpdateTaskForm);
