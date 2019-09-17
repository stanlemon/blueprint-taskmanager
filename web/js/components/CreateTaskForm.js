import React from "react";
import PropTypes from "prop-types";
import TaskForm from "./TaskForm";
import { connect } from "react-redux";
import { createTask } from "../actions";

export class CreateTaskForm extends React.Component {
  static propTypes = {
    createTask: PropTypes.func.isRequired,
    errors: PropTypes.object,
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
        errors={this.props.errors}
      />
    );
  }
}

export default connect(
  state => ({ errors: state.errors }),
  { createTask }
)(CreateTaskForm);
