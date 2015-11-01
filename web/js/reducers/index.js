import { ERROR, AUTHENTICATED_USER, UNAUTHENTICATED_USER, AUTHENTICATION_ERROR, LOAD_TASKS_SUCCESS, CREATE_TASK_SUCCESS, UPDATE_TASK_SUCCESS, DELETE_TASK_SUCCESS } from '../actions/';

function tasks(state = [], action: { type: string; }) {
    switch (action.type) {
        case LOAD_TASKS_SUCCESS:
            return [...action.tasks];
        case CREATE_TASK_SUCCESS:
            return [...state, action.task];
        case UPDATE_TASK_SUCCESS:
            return state.map(task => {
                return task.id === action.task.id ?
                    Object.assign({}, action.task) : task
            });
        case DELETE_TASK_SUCCESS:
            return state.filter(task => action.taskId != task.id);
        default:
            return state;
    }
}

function user(state = false, action) {
    switch (action.type) {
        case UNAUTHENTICATED_USER:
            return false;
        case AUTHENTICATED_USER:
            return Object.assign(action.user);
        default:
            return state;
    }
}

function error(state = [], action) {
    switch (action.type) {
        case ERROR:
        case AUTHENTICATION_ERROR:
            return [...state, action.error];
    }
    return state;
}

export default function(state = { tasks: [], loaded: false }, action) {
    let loaded = state.loaded;

    if (action.type == LOAD_TASKS_SUCCESS) {
        loaded = true;
    }

    return {
        user: user(state.user, action),
        tasks: tasks(state.tasks, action),
        loaded: loaded,
        error: error(state.error, action)
    }
}
