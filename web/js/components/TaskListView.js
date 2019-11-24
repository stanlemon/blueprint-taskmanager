import includes from "lodash/includes";
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { sortTasksByDate } from "../lib/Utils";
import CreateTaskForm from "./CreateTaskForm";
import TaskItem from "./TaskItem";
import { connect } from "react-redux";
import { Columns, Column } from "./elements/";

const ALL = "all";
const INCOMPLETE = "incomplete";
const COMPLETE = "complete";

export class TaskListView extends React.Component {
  static propTypes = {
    tasks: PropTypes.array.isRequired,
    errors: PropTypes.object,
    loaded: PropTypes.array,
  };

  static defaultProps = {
    tasks: [],
    errors: {},
    loaded: [],
  };

  state = {
    filter: ALL,
  };

  setFilter(filter) {
    this.setState({ filter });
  }

  setFilterToAll = () => this.setFilter(ALL);
  setFilterToIncomplete = () => this.setFilter(INCOMPLETE);
  setFilterToComplete = () => this.setFilter(COMPLETE);

  render() {
    const { filter } = this.state;
    const { loaded, errors } = this.props;

    if (!includes(loaded, "tasks")) {
      return (
        <div className="text-center">
          <i
            style={{ fontSize: "10em" }}
            className="text-primary fa fa-refresh fa-spin"
          />
        </div>
      );
    } else if (this.props.tasks.length === 0) {
      return (
        <div className="jumbotron">
          <h1>You don't have any tasks!</h1>
          <p>Use the form below to get started and add your first task.</p>
          <CreateTaskForm errors={errors} />
        </div>
      );
    }
    const tasks = sortTasksByDate(
      this.props.tasks.filter(task => {
        switch (this.state.filter) {
          case INCOMPLETE:
            return task.completed === null;
          case COMPLETE:
            return task.completed !== null;
          default:
            return true;
        }
      })
    );

    const btnClasses = classNames("btn", "btn-sm", "btn-info", "btn-default");
    const btnAll = classNames(btnClasses, "task-filter-all", {
      active: filter === ALL,
    });
    const btnIncomplete = classNames(btnClasses, "task-filter-incomplete", {
      active: filter === INCOMPLETE,
    });
    const btnComplete = classNames(btnClasses, "task-filter-complete", {
      active: filter === COMPLETE,
    });

    return (
      <>
        <Columns style={{ marginBottom: 10 }}>
          <Column size={4} offset={8}>
            <div className="btn-group btn-group-justified" role="group">
              <div className="btn-group" role="group">
                <button
                  type="button"
                  onClick={this.setFilterToAll}
                  className={btnAll}
                >
                  All
                </button>
              </div>
              <div className="btn-group" role="group">
                <button
                  type="button"
                  onClick={this.setFilterToIncomplete}
                  className={btnIncomplete}
                >
                  Incomplete
                </button>
              </div>
              <div className="btn-group" role="group">
                <button
                  type="button"
                  onClick={this.setFilterToComplete}
                  className={btnComplete}
                >
                  Complete
                </button>
              </div>
            </div>
          </Column>
        </Columns>

        {tasks.length === 0 && (
          <div
            className="text-center task-filter-none"
            style={{
              border: "1px solid #e3e3e3",
              borderRadius: 4,
              marginBottom: 10,
              padding: 10,
            }}
          >
            <em>There are no tasks for this filter.</em>
          </div>
        )}

        {tasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}

        <CreateTaskForm />
      </>
    );
  }
}

export default connect(
  state => ({ loaded: state.loaded, tasks: state.tasks }),
  {}
)(TaskListView);
