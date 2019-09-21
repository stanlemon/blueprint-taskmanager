import React from "react";
import PropTypes from "prop-types";
import TaskForm from "./TaskForm";
import { connect } from "react-redux";
import { navigateTo } from "../lib/Navigation";
import { updateTask } from "../actions";

export class UpdateTaskForm extends React.Component {
  handleSave = async data => {
    const response = await this.props.updateTask(data);

    if (response.errors) {
      return data;
    }

    // Default behavior here is to set state, but we can provide
    // a callback to handle state setting in a custm manner, or to
    // execute custom code after this is complete
    return () => {
      navigateTo("/");
    };
  };

  render() {
    return (
      <TaskForm
        className="task-update-form"
        tags={this.props.tags}
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
  tags: PropTypes.arrayOf(PropTypes.string),
  errors: PropTypes.object,
};

export default connect(
  state => ({ tags: state.tags, errors: state.errors }),
  { updateTask }
)(UpdateTaskForm);
