import classNames from "classnames";
import React from "react";
import PropTypes from "prop-types";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import addDays from "date-fns/addDays";
import format from "date-fns/format";
import { connect } from "react-redux";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { makeDateTime } from "../lib/Utils";
import { navigateTo } from "../lib/Navigation";
import { updateTask, deleteTask } from "../actions";
import { Columns, Column, Modal } from "./elements/";

export class TaskItem extends React.Component {
  state = {
    isConfirmingDelete: false,
  };

  confirmDeleteTask = () => {
    this.setState({ isConfirmingDelete: true });
  };

  cancelDeleteTask = () => {
    this.setState({ isConfirmingDelete: false });
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

    const rowClasses = classNames("task-row", {
      // Tasks due in the next day
      "has-background-warning task-due-soon":
        !task.completed &&
        task.due &&
        // Is after now
        isAfter(task.due, new Date()) &&
        // Is before 2 days from now
        isBefore(task.due, addDays(new Date(), 2)),
      // Tasks that are are over due
      "has-background-danger task-overdue":
        !task.completed && task.due && isBefore(task.due, new Date()),
      "task-completed": task.completed ? true : false,
    });

    return (
      <Columns flex={true} className={rowClasses} gutters={false}>
        <Column
          role="button"
          className="task-name"
          onClick={this.viewTask}
          style={{
            outline: 0,
          }}
        >
          <div style={{ padding: 10 }}>
            {task.name}
            {task.due && (
              <em
                className="has-text-grey is-size-7"
                style={{ marginLeft: 10 }}
              >
                {" "}
                due {format(task.due, "MMM d, yyyy h:mma")}
              </em>
            )}
          </div>
        </Column>
        <Column narrow className="has-text-right">
          <input
            type="checkbox"
            className="complete-task"
            checked={this.props.task.completed !== null}
            onChange={this.completeTask}
            style={{ marginRight: 20 }}
          />
          <a
            className="btn btn-xs btn-danger delete-task"
            onClick={this.confirmDeleteTask}
            style={{ marginRight: 20 }}
          >
            <Icon icon={faTrash} />
          </a>
        </Column>
        {this.state.isConfirmingDelete && (
          <Modal isActive={true} onClose={this.cancelDeleteTask}>
            <p className="has-text-centered">
              Are you sure you want to delete this task?
            </p>
            <div className="buttons is-centered">
              <button className="button is-danger" onClick={this.deleteTask}>
                Delete
              </button>
              <button className="button" onClick={this.cancelDeleteTask}>
                Cancel
              </button>
            </div>
          </Modal>
        )}
      </Columns>
    );
  }
}

TaskItem.propTypes = {
  deleteTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
};

/* istanbul ignore next */
export default connect(state => state, { updateTask, deleteTask })(TaskItem);
