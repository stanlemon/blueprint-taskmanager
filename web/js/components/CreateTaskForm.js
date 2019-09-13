import React from "react";
import PropTypes from "prop-types";
import TaskForm from "./TaskForm";
import { connect } from "react-redux";
import { createTask } from "../actions";

export class CreateTaskForm extends React.Component {
  static propTypes = {
    navigateTo: PropTypes.func,
    createTask: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  handleSave = data => {
    this.props.createTask(data);
    // Return a blank task
    return Object.assign({}, TaskForm.defaultProps.task);
  };

  render() {
    return (
      <TaskForm
        className="task-create-form"
        navigateTo={this.props.navigateTo}
        save={this.handleSave}
      />
    );
  }
}

export default connect(
  state => ({ errors: state.errors }),
  { createTask }
)(CreateTaskForm);
