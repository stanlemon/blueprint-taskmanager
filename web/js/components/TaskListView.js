import includes from "lodash/includes";
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { sortTasksByDate } from "../lib/Utils";
import CreateTaskForm from "./CreateTaskForm";
import TaskItem from "./TaskItem";
import { connect } from "react-redux";
import { Container, Columns, Column, Button } from "./elements/";

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
        <div className="is-centered">
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

    return (
      <Container>
        <div className="buttons has-addons is-right">
          <Button
            is="info"
            size="small"
            selected={filter === ALL}
            onClick={this.setFilterToAll}
          >
            All
          </Button>
          <Button
            is="info"
            size="small"
            selected={filter === INCOMPLETE}
            onClick={this.setFilterToIncomplete}
          >
            Incomplete
          </Button>
          <Button
            is="info"
            size="small"
            selected={filter === COMPLETE}
            onClick={this.setFilterToComplete}
          >
            Complete
          </Button>
        </div>

        {tasks.length === 0 && (
          <div
            className="is-centered task-filter-none"
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

        <br />
        <CreateTaskForm />
      </Container>
    );
  }
}

export default connect(
  state => ({ loaded: state.loaded, tasks: state.tasks }),
  {}
)(TaskListView);
