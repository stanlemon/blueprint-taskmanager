import classNames from "classnames";
import React from "react";
import PropTypes from "prop-types";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import addDays from "date-fns/addDays";
import { connect } from "react-redux";
import { makeDateTime } from "../lib/Utils";
import { navigateTo } from "../lib/Navigation";
import { updateTask, deleteTask } from "../actions";

export class TaskItem extends React.Component {
  static propTypes = {
    deleteTask: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    task: PropTypes.object.isRequired,
  };

  deleteTask = () => {
    this.props.deleteTask(this.props.task.id);
  };

  viewTask = () => {
    navigateTo(`/view/${this.props.task.id}`);
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

    const rowClasses = classNames("row", "row-no-gutters", "task-row", {
      // Tasks due in the next day
      "bg-warning task-due-soon":
        task.due &&
        !task.completed &&
        // Is after now
        isAfter(task.due, Date.now()) &&
        // Is before 2 days from now
        isBefore(task.due, addDays(Date.now(), 2)),
      // Tasks that are are over due
      "bg-danger task-overdue":
        task.due && !task.completed && isBefore(task.due, Date.now()),
      "task-completed": task.completed ? true : false,
    });

    return (
      <div className={rowClasses}>
        <div
          role="button"
          className="task-name col-xs-10 col-sm-11 col-md-11"
          onClick={this.viewTask}
          style={{
            outline: 0,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 20,
          }}
        >
          {task.name}
        </div>
        <div
          className="col-xs-2 col-sm-1 col-md-1"
          style={{ paddingTop: 10, paddingBottom: 10, paddingRight: 20 }}
        >
          <div className="col-xs-6 col-sm-6 text-left">
            <input
              type="checkbox"
              className="complete-task"
              checked={this.props.task.completed !== null}
              onChange={this.completeTask}
            />
          </div>
          <div className="col-xs-6 col-sm-6 text-right">
            <a
              className="btn btn-xs btn-danger delete-task"
              onClick={this.deleteTask}
            >
              <i
                className="fa fa-trash-o"
                style={{
                  padding: "3px",
                }}
              />
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => state, { updateTask, deleteTask })(TaskItem);
