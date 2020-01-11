import includes from "lodash/includes";
import isEmpty from "lodash/isEmpty";
import omit from "lodash/omit";
import format from "date-fns/format";
import React from "react";
import PropTypes from "prop-types";
import Error from "./Error";
import UpdateTaskForm from "./UpdateTaskForm";
import { getTask } from "../actions/";
import { DATE_FORMAT_LONG } from "../lib/Utils";
import { connect } from "react-redux";
import { getRouteParam, navigateTo } from "../lib/Navigation";
import { ROUTE_ROOT, ROUTE_TASK_VIEW } from "./Routes";

export function TaskView({ loaded = false, task }) {
  if (!loaded) {
    return <div />;
  }

  const handleReturnToList = () => navigateTo(ROUTE_ROOT);

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
  // Not required if loaded = false
  id: PropTypes.string,
  // Not required if loaded = false
  task: PropTypes.object,
  // Defaults to false if not set
  loaded: PropTypes.bool,
};

export default connect(
  state => ({
    loaded: includes(state.loaded, "tasks"),
    task: state.tasks?.byId?.[getRouteParam(ROUTE_TASK_VIEW, "id")],
  }),
  { getTask }
)(
  class TaskViewContainer extends React.Component {
    static propTypes = {
      getTask: PropTypes.func.isRequired,
    };

    componentDidMount() {
      this.props.getTask(getRouteParam(ROUTE_TASK_VIEW, "id"));
    }

    render() {
      return <TaskView {...omit(this.props, "getTask")} />;
    }
  }
);
