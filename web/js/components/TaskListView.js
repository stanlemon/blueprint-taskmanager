import includes from "lodash/includes";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import classNames from "classnames";
import { loadTasks } from "../actions/";
import { sortTasks } from "../lib/Utils";
import CreateTaskForm from "./CreateTaskForm";
import TaskItem from "./TaskItem";
import { Container, Button } from "./elements/";

const ALL = "all";
const INCOMPLETE = "incomplete";
const COMPLETE = "complete";

export class TaskListView extends React.Component {
  static propTypes = {
    loadTasks: PropTypes.func,
    page: PropTypes.number,
    pages: PropTypes.number,
    tasks: PropTypes.array.isRequired,
    errors: PropTypes.object,
    loaded: PropTypes.array,
  };

  static defaultProps = {
    page: 1,
    pages: 1,
    tasks: [],
    errors: {},
    loaded: [],
  };

  state = {
    filter: ALL,
  };

  componentDidMount() {
    this.props.loadTasks();
  }

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
        <div className="has-text-centered">
          <Icon icon={faSpinner} size="3x" spin />
          <div style={{ marginTop: 10 }}>
            <em>Loading...</em>
          </div>
        </div>
      );
    } else if (this.props.tasks.byId.length === 0) {
      return (
        <div className="jumbotron">
          <h1>You don't have any tasks!</h1>
          <p>Use the form below to get started and add your first task.</p>
          <CreateTaskForm errors={errors} />
        </div>
      );
    }
    const tasks = sortTasks(
      Object.values(this.props.tasks.byId).filter(task => {
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
        <div className="buttons has-addons is-centered">
          <Button
            className={classNames({ "is-active": filter === ALL })}
            id="task-filter-all"
            is="info"
            size="small"
            selected={filter === ALL}
            onClick={this.setFilterToAll}
          >
            All
          </Button>
          <Button
            className={classNames({ "is-active": filter === INCOMPLETE })}
            id="task-filter-incomplete"
            is="info"
            size="small"
            selected={filter === INCOMPLETE}
            onClick={this.setFilterToIncomplete}
          >
            Incomplete
          </Button>
          <Button
            className={classNames({ "is-active": filter === COMPLETE })}
            id="task-filter-complete"
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
            className="has-text-centered task-filter-none"
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

        {this.props.pages > 1 && (
          <nav
            className="pagination is-centered"
            role="navigation"
            aria-label="pagination"
            style={{ marginTop: "1rem" }}
          >
            <button
              className="button pagination-previous"
              disabled={this.props.page > 1}
              onClick={() => this.jumpToPage(this.props.page - 1)}
            >
              Previous
            </button>
            <button
              className="button pagination-next"
              disabled={this.props.page === this.props.pages}
              onClick={() => this.jumpToPage(this.props.page + 1)}
            >
              Next page
            </button>
            <ul className="pagination-list">
              {/*<li>
                <span className="pagination-ellipsis">&hellip;</span>
              </li>*/}
              {[...Array(this.props.pages + 1).keys()].slice(1).map(page => (
                <li key={`page-${page}`}>
                  <button
                    className={classNames("button", "pagination-link", {
                      "is-current": this.props.page === page,
                    })}
                    aria-label={`Goto page ${page}`}
                    onClick={() => this.jumpToPage(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <h1
          className="title is-3"
          style={{ marginTop: "2rem", marginBottom: ".25rem" }}
        >
          New Task
        </h1>
        <CreateTaskForm />
      </Container>
    );
  }
}

export default connect(
  state => ({ loaded: state.loaded, tasks: state.tasks }),
  { loadTasks }
)(TaskListView);
