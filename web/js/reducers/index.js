/* @flow weak */
import uniq from "lodash/uniq";
import isArray from "lodash/isArray";
import {
  ERROR,
  CLEAR_ERRORS,
  AUTHENTICATED_USER,
  UNAUTHENTICATED_USER,
  SAVE_USER,
  USER_ERROR,
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

export const initialState = {
  user: null,
  tags: [],
  filter: FILTER_ALL,
  page: 1,
  tasks: {},
  loaded: [],
  errors: [],
};

// Ensure that we have valid dates in our tasks objects
function formatTaskDates(task) {
  return Object.assign({}, task, {
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    completed: task.completed ? new Date(task.completed) : null,
    due: task.due ? new Date(task.due) : null,
  });
}

export function tags(state = initialState.tags, action) {
  switch (action.type) {
    case LOAD_TAGS_SUCCESS:
      return [...action.tags];
    default:
      return state;
  }
}

export function tasks(state = initialState.tasks, action) {
  switch (action.type) {
    case GET_TASK_SUCCESS:
      return {
        ...state,
        tasks: [
          // Only if the existing tasks are an array (means we've loaded them before)
          ...(isArray(state.tasks)
            ? // Exclude the current task we're getting if it's there, because we'll replace it
              state.tasks.filter((t) => t.id !== action.task.id)
            : []),
          formatTaskDates(action.task),
        ],
      };
    case LOAD_TASKS_SUCCESS:
      return {
        // All the other state
        ...state,
        ...action.tasks,
        // Make sure you preserve the order of these tasks (see the db call)
        tasks: action.tasks.tasks.map((d) => formatTaskDates(d)),
      };
    // These preserve the existing state, they don't clear out the state so that existing data doesn't blank out,
    // but the actions immediately trigger a LOAD_TASK... operation, so the data will be refreshed on these.
    case CREATE_TASK_SUCCESS:
    case UPDATE_TASK_SUCCESS:
    case DELETE_TASK_SUCCESS:
    default:
      return { ...state };
  }
}

export function user(state = initialState.user, action) {
  switch (action.type) {
    case UNAUTHENTICATED_USER:
      return null;
    case AUTHENTICATED_USER:
    case SAVE_USER:
      return Object.assign({}, action.user);
    default:
      return state;
  }
}

export function errors(state = initialState.errors, action) {
  switch (action.type) {
    case ERROR:
    case LOAD_TAGS_ERROR:
    case GET_TASK_ERROR:
    case LOAD_TASKS_ERROR:
    case CREATE_TASK_ERROR:
    case UPDATE_TASK_ERROR:
    case DELETE_TASK_ERROR:
    case AUTHENTICATION_ERROR:
    case USER_ERROR:
    case REGISTER_ERROR:
      return { ...state, ...action.errors };
    case CLEAR_ERRORS:
      return {};
    default:
      return { ...state };
  }
}

export function loaded(state = initialState.loaded, action) {
  switch (action.type) {
    case LOAD_TAGS_ERROR:
      return uniq([...state, "tags"]);
    case GET_TASK_ERROR:
    case LOAD_TASKS_ERROR:
    case CREATE_TASK_ERROR:
    case UPDATE_TASK_ERROR:
    case DELETE_TASK_ERROR:
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

export function filter(state = initialState.filter, action) {
  switch (action.type) {
    case SET_FILTER:
      return action.filter;
    default:
      return state;
  }
}

export function page(state = initialState.page, action) {
  switch (action.type) {
    case SET_PAGE:
      return action.page;
    default:
      return state;
  }
}

export function reducers(state = initialState, action) {
  return {
    user: user(state.user, action),
    tags: tags(state.tags, action),
    filter: filter(state.filter, action),
    page: page(state.page, action),
    tasks: tasks(state.tasks, action),
    loaded: loaded(state.loaded, action),
    errors: errors(state.errors, action),
  };
}

export default reducers;
