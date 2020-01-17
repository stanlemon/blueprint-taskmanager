import React from "react";
import PropTypes from "prop-types";
import TaskForm from "./TaskForm";
import { connect } from "react-redux";
import { navigateTo } from "../lib/Navigation";
import { updateTask } from "../actions";
import { ROUTE_ROOT } from "./Routes";

export class UpdateTaskForm extends React.Component {
  handleSave = async data => {
    const response = await this.props.updateTask(data);

    if (response && response.errors) {
      return data;
    }

    // Default behavior here is to set state, but we can provide
    // a callback to handle state setting in a custm manner, or to
    // execute custom code after this is complete
    return () => {
      navigateTo(ROUTE_ROOT);
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

/* istanbul ignore next */
export default connect(({ tags, errors }) => ({ tags, errors }), {
  updateTask,
})(UpdateTaskForm);
