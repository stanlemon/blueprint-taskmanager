import isEqual from "lodash/isEqual";
import isArray from "lodash/isArray";

export const ERROR = "ERROR";
export const CLEAR_ERRORS = "CLEAR_ERRORS";
export const AUTHENTICATED_USER = "AUTHENTICATED_USER";
export const UNAUTHENTICATED_USER = "UNAUTHENTICATED_USER";
export const SAVE_USER = "SAVE_USER";
export const USER_ERROR = "USER_ERROR";
export const AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR";
export const REGISTER_ERROR = "REGISTER_ERROR";
export const LOAD_TAGS_SUCCESS = "LOAD_TAGS_SUCCESS";
export const LOAD_TAGS_ERROR = "LOAD_TAGS_ERROR";
export const SET_FILTER = "SET_FILTER";
export const SET_PAGE = "SET_PAGE";
export const LOAD_TASKS_SUCCESS = "LOAD_TASKS_SUCCESS";
export const LOAD_TASKS_ERROR = "LOAD_TASKS_ERROR";
export const GET_TASK_SUCCESS = "GET_TASK_SUCCESS";
export const GET_TASK_ERROR = "GET_TASK_ERROR";
export const CREATE_TASK_SUCCESS = "CREATE_TASK_SUCCESS";
export const CREATE_TASK_ERROR = "CREATE_TASK_ERROR";
export const UPDATE_TASK_SUCCESS = "UPDATE_TASK_SUCCESS";
export const UPDATE_TASK_ERROR = "UPDATE_TASK_ERROR";
export const DELETE_TASK_SUCCESS = "DELETE_TASK_SUCCESS";
export const DELETE_TASK_ERROR = "DELETE_TASK_ERROR";

export const FILTER_ALL = "all";
export const FILTER_INCOMPLETE = "incomplete";
export const FILTER_COMPLETE = "complete";

export function addErrors(errors) {
  return { type: ERROR, errors };
}

export function clearErrors() {
  return (dispatch, getState) => {
    if (isEqual({}, getState().errors)) {
      return;
    }

    dispatch({ type: CLEAR_ERRORS });
  };
}

export function loadUser(user) {
  if (user !== false) {
    return { type: AUTHENTICATED_USER, user };
  }
  return { type: UNAUTHENTICATED_USER };
}

export function saveUser(user) {
  return (dispatch, getState, { userService }) => {
    return userService
      .saveUser(user)
      .then((res) => {
        dispatch({ type: SAVE_USER, user: res });
        return res;
      })
      .catch((ex) => {
        dispatch({ type: USER_ERROR, errors: ex.errors });
      });
  };
}

export function logout() {
  return (dispatch, getState, { userService }) => {
    userService
      .logout()
      .then(() => {
        dispatch({ type: CLEAR_ERRORS });
        dispatch({ type: UNAUTHENTICATED_USER });
      })
      .catch((ex) => {
        dispatch({ type: AUTHENTICATION_ERROR, errors: ex.errors });
      });
  };
}

export function loadTags() {
  return (dispatch, getState, { tagService }) => {
    tagService
      .loadTags()
      .then((tags) => {
        dispatch({ type: LOAD_TAGS_SUCCESS, tags });
      })
      .catch((ex) => {
        dispatch({ type: LOAD_TAGS_ERROR, errors: ex.errors });
      });
  };
}

export function setFilter(filter) {
  return (dispatch, getState, services) => {
    // No filter change, bail
    if (filter === getState().filter) {
      return;
    }

    dispatch({ type: SET_FILTER, filter });
    // Reset the page number
    dispatch({ type: SET_PAGE, page: 1 });
    // Trigger a reload with the new filter and reset the page
    loadTasks(filter, 1)(dispatch, getState, services);
  };
}

export function setPage(page) {
  return (dispatch, getState, services) => {
    // No page change, bail
    if (page === getState().page) {
      return;
    }

    // Reset the page number
    dispatch({ type: SET_PAGE, page });
    // Trigger a reload with the new filter and reset the page
    loadTasks(getState().filter, page)(dispatch, getState, services);
  };
}

// TODO: If filter & page are not changing we shouldn't reload. Add caching
export function loadTasks(filter, page) {
  return (dispatch, getState, { taskService }) => {
    taskService
      .loadTasks(filter, page)
      .then((tasks) => {
        dispatch({ type: LOAD_TASKS_SUCCESS, tasks: tasks });
      })
      .catch((ex) => {
        dispatch({ type: LOAD_TASKS_ERROR, errors: ex.errors });
      });
  };
}

export function getTask(id) {
  return (dispatch, getState, { taskService }) => {
    const { tasks } = getState()?.tasks;

    // If we have the specific task cached, return it rather than hit the api
    if (isArray(tasks)) {
      const task = tasks?.filter((t) => t.id !== id)[0];

      if (task) {
        dispatch({ type: GET_TASK_SUCCESS, task: task });
        return task;
      }
    }

    taskService
      .getTask(id)
      .then((task) => {
        dispatch({ type: GET_TASK_SUCCESS, task });
      })
      .catch((ex) => {
        dispatch({ type: GET_TASK_ERROR, errors: ex.errors });
      });
  };
}

export function createTask(data) {
  return (dispatch, getState, { taskService }) => {
    return taskService
      .createTask(data)
      .then((task) => {
        dispatch({ type: CLEAR_ERRORS });
        dispatch({ type: CREATE_TASK_SUCCESS, task });
        loadTasks(getState().filter, getState().page)(dispatch, getState, {
          taskService,
        });
        return task;
      })
      .catch((ex) => {
        dispatch({ type: CREATE_TASK_ERROR, errors: ex.errors });
        return { errors: ex.errors };
      });
  };
}

export function updateTask(data) {
  return (dispatch, getState, { taskService }) => {
    return taskService
      .updateTask(data)
      .then((task) => {
        dispatch({ type: CLEAR_ERRORS });
        dispatch({ type: UPDATE_TASK_SUCCESS, task });
        loadTasks(getState().filter, getState().page)(dispatch, getState, {
          taskService,
        });
        return task;
      })
      .catch((ex) => {
        dispatch({ type: UPDATE_TASK_ERROR, errors: ex.errors });
        return { errors: ex.errors };
      });
  };
}

export function deleteTask(taskId) {
  return (dispatch, getState, { taskService }) => {
    return taskService
      .deleteTask(taskId)
      .then(() => {
        dispatch({ type: CLEAR_ERRORS });
        dispatch({ type: DELETE_TASK_SUCCESS, taskId });
        loadTasks(getState().filter, getState().page)(dispatch, getState, {
          taskService,
        });
      })
      .catch((ex) => {
        dispatch({ type: DELETE_TASK_ERROR, errors: ex.errors });
      });
  };
}

export function checkSession() {
  return (dispatch, getState, { userService }) => {
    userService
      .checkSession()
      .then(({ user }) => {
        // Skipping the session check action if nothing has actually changed
        if (isEqual(getState().user, user)) {
          return;
        }

        if (user === false) {
          dispatch({ type: UNAUTHENTICATED_USER });
        } else {
          dispatch({ type: AUTHENTICATED_USER, user });
        }
      })
      .catch((ex) => {
        // Likely a 403
        dispatch({ type: UNAUTHENTICATED_USER });
        dispatch({ type: AUTHENTICATION_ERROR, errors: ex.errors });
      });
  };
}

export function registerUser(user) {
  return (dispatch, getState, { userService }) => {
    userService
      .register(user)
      .then((data) => {
        dispatch({ type: CLEAR_ERRORS });
        dispatch({ type: AUTHENTICATED_USER, user: data });
      })
      .catch((ex) => {
        dispatch({ type: REGISTER_ERROR, errors: ex.errors });
      });
  };
}

export function login(user) {
  return (dispatch, getState, { userService }) => {
    userService
      .login(user)
      .then((data) => {
        dispatch({ type: CLEAR_ERRORS });
        dispatch({ type: AUTHENTICATED_USER, user: data.user });
      })
      .catch(() => {
        dispatch({
          type: AUTHENTICATION_ERROR,
          errors: { main: "Invalid username or password." },
        });
      });
  };
}

export function verify(token) {
  return (dispatch, getState, { userService }) => {
    return userService.verify(token);
  };
}
