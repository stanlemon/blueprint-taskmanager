import includes from "lodash/includes";
import isEmpty from "lodash/isEmpty";
import format from "date-fns/format";
import React from "react";
import PropTypes from "prop-types";
import Error from "./Error";
import UpdateTaskForm from "./UpdateTaskForm";
import { DATE_FORMAT_LONG } from "../lib/Utils";
import { connect } from "react-redux";
import { getRouteParams, navigateTo } from "../lib/Navigation";
import { ROUTE_TASK_VIEW } from "./Routes";

export function TaskView({ loaded, tasks }) {
  if (!includes(loaded, "tasks")) {
    return <div />;
  }

  const handleReturnToList = () => navigateTo("/");

  const { id } = getRouteParams(ROUTE_TASK_VIEW);
  const taskId = parseInt(id, 10);

  const task = Object.assign({}, tasks.filter(t => t.id === taskId)[0]);

  if (isEmpty(task)) {
    return (
      <div>
        <Error message="Task does not exist." />
        <a className="btn btn-link" onClick={handleReturnToList}>
          Go back to list
        </a>
      </div>
    );
  }

  return (
    <div>
      <UpdateTaskForm task={task} />

      <p>
        <strong>Created: </strong>
        <span>{format(task.createdAt, DATE_FORMAT_LONG)}</span>
      </p>
      <p>
        <strong>Last Updated: </strong>
        <span>{format(task.updatedAt, DATE_FORMAT_LONG)}</span>
      </p>
    </div>
  );
}

TaskView.propTypes = {
  tasks: PropTypes.array.isRequired,
  loaded: PropTypes.array,
};

TaskView.defaultProps = {
  loaded: [],
  tasks: [],
};

export default connect(
  state => ({ loaded: state.loaded, tasks: state.tasks }),
  {}
)(TaskView);
