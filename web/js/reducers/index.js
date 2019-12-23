/* @flow weak */
import uniq from "lodash/uniq";
import keyBy from "lodash/keyBy";
import omit from "lodash/omit";
import {
  ERROR,
  CLEAR_ERRORS,
  AUTHENTICATED_USER,
  UNAUTHENTICATED_USER,
  AUTHENTICATION_ERROR,
  REGISTER_ERROR,
  LOAD_TAGS_SUCCESS,
  LOAD_TAGS_ERROR,
  SET_FILTER,
  FILTER_ALL,
  SET_PAGE,
  LOAD_TASKS_SUCCESS,
  LOAD_TASKS_ERROR,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_ERROR,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_ERROR,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_ERROR,
  GET_TASK_SUCCESS,
  GET_TASK_ERROR,
} from "../actions/";

// Ensure that we have valid dates in our tasks objects
function formatTaskDates(task) {
  return Object.assign({}, task, {
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    completed: task.completed ? new Date(task.completed) : null,
    due: task.due ? new Date(task.due) : null,
  });
}

export function tags(state, action) {
  switch (action.type) {
    case LOAD_TAGS_SUCCESS:
      return [...action.tags];
    default:
      return state;
  }
}

export function tasks(state, action) {
  switch (action.type) {
    case GET_TASK_SUCCESS:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.task.id]: formatTaskDates(action.task),
        },
      };
    case LOAD_TASKS_SUCCESS:
      return {
        // All the other state
        ...state,
        byId: {
          // Existing tasks by id
          ...state.byId,
          // Our new tasks by id
          ...keyBy(
            // Clean up our dates
            action.tasks.tasks.map(d => formatTaskDates(d)),
            // Key these into the map by id
            t => t.id
          ),
        },
      };
    case CREATE_TASK_SUCCESS:
    case UPDATE_TASK_SUCCESS:
      return {
        // All the other state
        ...state,
        byId: {
          // Existing tasks by id
          ...state.byId,
          // Overwrite this task
          [action.task.id]: formatTaskDates(action.task),
        },
      };
    case DELETE_TASK_SUCCESS:
      return {
        // All the other state
        ...state,
        byId: {
          // Remove our task
          ...omit(state.byId, action.taskId),
        },
      };
    default:
      return { ...state };
  }
}

export function user(state, action) {
  switch (action.type) {
    case UNAUTHENTICATED_USER:
      return null;
    case AUTHENTICATED_USER:
      return Object.assign({}, action.user);
    default:
      return state;
  }
}

export function errors(state, action) {
  switch (action.type) {
    case ERROR:
    case LOAD_TAGS_ERROR:
    case GET_TASK_ERROR:
    case LOAD_TASKS_ERROR:
    case CREATE_TASK_ERROR:
    case UPDATE_TASK_ERROR:
    case DELETE_TASK_ERROR:
    case AUTHENTICATION_ERROR:
    case REGISTER_ERROR:
      return { ...state, ...action.errors };
    case CLEAR_ERRORS:
      return {};
    default:
      return { ...state };
  }
}

export function loaded(state, action) {
  switch (action.type) {
    case GET_TASK_SUCCESS:
    case LOAD_TASKS_SUCCESS:
      return uniq([...state, "tasks"]);
    case UNAUTHENTICATED_USER:
    case AUTHENTICATED_USER:
      return uniq([...state, "user"]);
    default:
      return state;
  }
}

export function filter(state, action) {
  switch (action.type) {
    case SET_FILTER:
      return action.filter;
    default:
      return state;
  }
}

export function page(state, action) {
  switch (action.type) {
    case SET_PAGE:
      return action.page;
    default:
      return state;
  }
}

export default function(
  state = {
    user: null,
    tags: [],
    filter: FILTER_ALL,
    page: 1,
    tasks: {},
    loaded: [],
    errors: [],
  },
  action
) {
  const y = {
    user: user(state.user, action),
    tags: tags(state.tags, action),
    filter: filter(state.filter, action),
    page: page(state.page, action),
    tasks: tasks(state.tasks, action),
    loaded: loaded(state.loaded, action),
    errors: errors(state.errors, action),
  };
  //console.log("redux store = ", y);
  return y;
}
