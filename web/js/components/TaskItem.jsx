import React from "react";
import PropTypes from "prop-types";
import { isAfter, isBefore, addDays, format } from "date-fns";
import { connect } from "react-redux";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { makeDateTime } from "../lib/Utils";
import { navigateTo } from "../lib/Navigation";
import { updateTask, deleteTask } from "../actions";
import { Columns, Column, Modal, Button, Center, Spacer } from "./elements/";

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
    // Delete the task
    this.props.deleteTask(this.props.task.id);
    // Close the modal
    this.setState({ isConfirmingDelete: false });
  };

  viewTask = () => {
    navigateTo(`/view/${this.props.task.id}`);
  };

  completeTask = (event) => {
    const checked = event.target.checked;
    this.props.updateTask(
      Object.assign({}, this.props.task, {
        completed: checked ? makeDateTime() : null,
      })
    );
  };

  render() {
    const { task } = this.props;

    const styles = {
      cursor: "pointer",
      padding: 10,
      textDecoration: task.completed ? "line-through" : "none",
      color: getTaskTextColor(task),
    };

    return (
      <Columns className="task-row">
        <Column
          size={22}
          className="task-name"
          style={styles}
          onClick={this.viewTask}
        >
          {task.name}
          {task.due && <em> due {format(task.due, "MMM d, yyyy h:mma")}</em>}
        </Column>
        <Column size={1}>
          <input
            type="checkbox"
            checked={this.props.task.completed !== null}
            onChange={this.completeTask}
          />
        </Column>
        <Column size={1}>
          <Button
            className="task-delete"
            is="danger"
            width="none"
            onClick={this.confirmDeleteTask}
          >
            <Icon icon={faTrash} title="Delete Task" />
          </Button>
        </Column>
        {this.state.isConfirmingDelete && (
          <Modal isActive={true} onClose={this.cancelDeleteTask}>
            <p>Are you sure you want to delete this task?</p>
            <Spacer />
            <Center>
              <Button
                className="task-delete-confirm"
                is="danger"
                onClick={this.deleteTask}
              >
                Delete
              </Button>
              <Button onClick={this.cancelDeleteTask}>Cancel</Button>
            </Center>
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
export default connect((state) => state, { updateTask, deleteTask })(TaskItem);

function getTaskTextColor(task) {
  const dueSoon =
    // Is not complete
    !task.completed &&
    // Has a due date
    task.due &&
    // Is after now
    isAfter(task.due, new Date()) &&
    // Is before 2 days from now
    isBefore(task.due, addDays(new Date(), 2));
  const overDue = !task.completed && task.due && isBefore(task.due, new Date());

  if (dueSoon) {
    return "orange";
  } else if (overDue) {
    return "red";
  } else {
    return "inherit";
  }
}
