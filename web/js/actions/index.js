import isEqual from "lodash/isEqual";

export const ERROR = "ERROR";
export const CLEAR_ERRORS = "CLEAR_ERRORS";
export const AUTHENTICATED_USER = "AUTHENTICATED_USER";
export const UNAUTHENTICATED_USER = "UNAUTHENTICATED_USER";
export const AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR";
export const REGISTER_ERROR = "REGISTER_ERROR";
export const LOAD_TASKS_SUCCESS = "LOAD_TASKS_SUCCESS";
export const LOAD_TASKS_ERROR = "LOAD_TASKS_ERROR";
export const CREATE_TASK_SUCCESS = "CREATE_TASK_SUCCESS";
export const CREATE_TASK_ERROR = "CREATE_TASK_ERROR";
export const UPDATE_TASK_SUCCESS = "UPDATE_TASK_SUCCESS";
export const UPDATE_TASK_ERROR = "UPDATE_TASK_ERROR";
export const DELETE_TASK_SUCCESS = "DELETE_TASK_SUCCESS";
export const DELETE_TASK_ERROR = "DELETE_TASK_ERROR";

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

export function logout() {
  return (dispatch, getState, { userService }) => {
    userService
      .logout()
      .then(() => {
        dispatch({ type: CLEAR_ERRORS });
        dispatch({ type: UNAUTHENTICATED_USER });
      })
      .catch(ex => {
        dispatch({ type: AUTHENTICATION_ERROR, errors: ex.errors });
      });
  };
}

export function loadTasks() {
  return (dispatch, getState, { taskService }) => {
    taskService
      .loadTasks()
      .then(tasks => {
        dispatch({ type: LOAD_TASKS_SUCCESS, tasks });
      })
      .catch(ex => {
        dispatch({ type: LOAD_TASKS_ERROR, errors: ex.errors });
      });
  };
}

export function createTask(data) {
  return (dispatch, getState, { taskService }) => {
    return taskService
      .createTask(data)
      .then(task => {
        dispatch({ type: CLEAR_ERRORS });
        dispatch({ type: CREATE_TASK_SUCCESS, task });
        return task;
      })
      .catch(ex => {
        dispatch({ type: CREATE_TASK_ERROR, errors: ex.errors });
        return { errors: ex.errors };
      });
  };
}

export function updateTask(data) {
  return (dispatch, getState, { taskService }) => {
    return taskService
      .updateTask(data)
      .then(task => {
        dispatch({ type: CLEAR_ERRORS });
        dispatch({ type: UPDATE_TASK_SUCCESS, task });
        return task;
      })
      .catch(ex => {
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
      })
      .catch(ex => {
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
      .catch(ex => {
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
      .then(data => {
        dispatch({ type: CLEAR_ERRORS });
        dispatch({ type: AUTHENTICATED_USER, user: data });
      })
      .catch(ex => {
        dispatch({ type: REGISTER_ERROR, errors: ex.errors });
      });
  };
}

export function login(user) {
  return (dispatch, getState, { userService }) => {
    userService
      .login(user)
      .then(data => {
        dispatch({ type: CLEAR_ERRORS });
        dispatch({ type: AUTHENTICATED_USER, user: data });
      })
      .catch(() => {
        dispatch({
          type: AUTHENTICATION_ERROR,
          errors: { main: "Invalid username or password." },
        });
      });
  };
}
