import includes from "lodash/includes";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { loadTasks, setFilter, setPage } from "../actions/";
import CreateTaskForm from "./CreateTaskForm";
import TaskItem from "./TaskItem";
import {
  Container,
  Button,
  ButtonGroup,
  Spacer,
  Center,
  Divider,
  Pagination,
} from "./elements/";

const ALL = "all";
const INCOMPLETE = "incomplete";
const COMPLETE = "complete";

export class TaskListView extends React.Component {
  componentDidMount() {
    this.props.loadTasks(this.props.filter, this.props.page);
  }

  setPage = (page) => {
    this.props.setPage(page);
  };

  setFilter(filter) {
    this.props.setFilter(filter);
  }

  setFilterToAll = () => this.setFilter(ALL);
  setFilterToIncomplete = () => this.setFilter(INCOMPLETE);
  setFilterToComplete = () => this.setFilter(COMPLETE);

  render() {
    const { loaded, errors, hasTasks, tasks, filter } = this.props;

    if (!includes(loaded, "tasks")) {
      return (
        <Center>
          <Icon icon={faSpinner} size="3x" spin />
          <Spacer />
          <div>
            <em>Loading...</em>
          </div>
        </Center>
      );
    }

    if (!hasTasks) {
      return (
        <div>
          <h1>You don't have any tasks!</h1>
          <p>
            <em>Use the form below to get started and add your first task.</em>
          </p>
          <CreateTaskForm errors={errors} />
        </div>
      );
    }

    const { pages, page } = this.props;

    return (
      <Container>
        <ButtonGroup style={{ marginBottom: 10 }}>
          <Button
            id="task-filter-all"
            is="default"
            selected={filter === ALL}
            onClick={this.setFilterToAll}
          >
            All
          </Button>
          <Button
            id="task-filter-incomplete"
            is="default"
            selected={filter === INCOMPLETE}
            onClick={this.setFilterToIncomplete}
          >
            Incomplete
          </Button>
          <Button
            id="task-filter-complete"
            is="default"
            selected={filter === COMPLETE}
            onClick={this.setFilterToComplete}
          >
            Complete
          </Button>
        </ButtonGroup>
        {tasks.length === 0 && <em>There are no tasks for this filter.</em>}
        <div>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
        {pages > 1 && (
          <Pagination
            total={pages * 10}
            limit={10}
            activePage={page}
            onChangePage={this.setPage}
          />
        )}
        <Divider />
        <h2>New Task</h2>
        <CreateTaskForm />
      </Container>
    );
  }
}

TaskListView.propTypes = {
  loadTasks: PropTypes.func,
  setFilter: PropTypes.func,
  setPage: PropTypes.func,
  filter: PropTypes.string,
  page: PropTypes.number,
  pages: PropTypes.number,
  hasTasks: PropTypes.bool,
  tasks: PropTypes.array.isRequired,
  errors: PropTypes.object,
  loaded: PropTypes.array,
};

TaskListView.defaultProps = {
  page: 1,
  pages: 1,
  tasks: [],
  errors: {},
  loaded: [],
};

/* istanbul ignore next */
export default connect(
  (state) => ({
    loaded: state.loaded,
    hasTasks: state.tasks.all > 0,
    ...state.tasks,
  }),
  { loadTasks, setFilter, setPage }
)(TaskListView);
