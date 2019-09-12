import classNames from "classnames";
import React from "react";
import PropTypes from "prop-types";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import subDays from "date-fns/subDays";
import { makeDateTime } from "../lib/Utils";

export default class TaskItem extends React.Component {
  static propTypes = {
    navigateTo: PropTypes.func.isRequired,
    deleteTask: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    task: PropTypes.object.isRequired,
  };

  deleteTask = () => {
    this.props.deleteTask(this.props.task.id);
  };

  viewTask = () => {
    this.props.navigateTo(`/view/${this.props.task.id}`);
  };

  completeTask = event => {
    const checked = event.target.checked;
    this.props.updateTask(
      Object.assign({}, this.props.task, {
        completed: checked ? makeDateTime() : null,
      })
    );
  };

  render() {
    const { task } = this.props;

    const rowClasses = classNames("task-row", {
      // Tasks due in the next day
      "bg-warning task-due-soon":
        task.due &&
        !task.completed &&
        isAfter(task.due, subDays(new Date(), 2)),
      // Tasks that are are over due
      "bg-danger task-overdue":
        task.due && !task.completed && isBefore(task.due, new Date()),
      "task-completed": task.completed ? true : false,
    });

    return (
      <div className={rowClasses}>
        <div className="row" style={{ margin: "10px" }}>
          <div
            role="button"
            className="task-name col-xs-9 col-sm-9 col-md-10"
            onClick={this.viewTask}
            onKeyDown={this.viewTask}
            tabIndex={0}
          >
            {task.name}
          </div>
          <div className="col-xs-3 col-sm-3 col-md-2">
            <div className="row">
              <div className="col-xs-6 col-sm-6 text-right">
                <input
                  type="checkbox"
                  className="complete-task"
                  checked={this.props.task.completed !== null}
                  onChange={this.completeTask}
                />
              </div>
              <div className="col-xs-6 col-sm-6 text-right">
                <button
                  className="btn btn-xs btn-danger delete-task"
                  onClick={this.deleteTask}
                >
                  <i
                    className="fa fa-trash-o"
                    style={{
                      padding: "3px",
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
