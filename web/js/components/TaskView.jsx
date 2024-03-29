import includes from "lodash/includes";
import isEmpty from "lodash/isEmpty";
import { format } from "date-fns";
import React from "react";
import PropTypes from "prop-types";
import Error from "./Error";
import UpdateTaskForm from "./UpdateTaskForm";
import { getTask } from "../actions/";
import { DATE_FORMAT_LONG } from "../lib/Utils";
import { connect } from "react-redux";
import { getRouteParam, navigateTo } from "../lib/Navigation";
import { ROUTE_ROOT, ROUTE_TASK_VIEW } from "./Routes";
import { Button } from "./elements/";
import findOneById from "../reducers/findOneById";

export function TaskView({ loaded, task }) {
  if (!loaded) {
    return <div>Loading...</div>;
  }

  const handleReturnToList = () => navigateTo(ROUTE_ROOT);

  if (isEmpty(task)) {
    return (
      <div>
        <Error message="Task does not exist." />
        <Button onClick={handleReturnToList}>Go back to task list</Button>
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
  // Not required if loaded = false
  id: PropTypes.number,
  // Not required if loaded = false
  task: PropTypes.object,
  // Defaults to false if not set
  loaded: PropTypes.bool,
};

class TaskViewContainer extends React.Component {
  componentDidMount() {
    this.props.getTask(parseInt(getRouteParam(ROUTE_TASK_VIEW, "id"), 10));
  }

  render() {
    return (
      <TaskView
        loaded={this.props.loaded}
        id={this.props?.task?.id}
        task={this.props?.task}
      />
    );
  }
}

TaskViewContainer.propTypes = {
  loaded: PropTypes.bool,
  task: PropTypes.object,
  getTask: PropTypes.func.isRequired,
};

/* istanbul ignore next */
export default connect(
  (state) => ({
    loaded: includes(state.loaded, "tasks"),
    task: findOneById(
      state?.tasks?.tasks,
      getRouteParam(ROUTE_TASK_VIEW, "id")
    ),
  }),
  { getTask }
)(TaskViewContainer);
