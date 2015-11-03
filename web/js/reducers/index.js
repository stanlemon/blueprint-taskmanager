import {
    ERROR
  , AUTHENTICATED_USER
  , UNAUTHENTICATED_USER
  , AUTHENTICATION_ERROR
  , LOAD_TASKS_SUCCESS
  , LOAD_TASKS_ERROR
  , CREATE_TASK_SUCCESS
  , CREATE_TASK_ERROR
  , UPDATE_TASK_SUCCESS
  , UPDATE_TASK_ERROR
  , DELETE_TASK_SUCCESS
  , DELETE_TASK_ERROR
} from '../actions/';

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

function loaded(state = new Set(), action) {
    switch (action.type) {
        case LOAD_TASKS_SUCCESS:
            return new Set([...state, 'tasks']);
        case UNAUTHENTICATED_USER:
        case AUTHENTICATED_USER:
            return new Set([...state, 'user']);
        default:
            return state;
    }
}

export default function(state = {}, action) {
    return {
        user:   user(state.user, action),
        tasks:  tasks(state.tasks, action),
        loaded: loaded(state.loaded, action),
        error:  error(state.error, action)
    }
}
