import { LOAD_TASKS_SUCCESS, CREATE_TASK_SUCCESS, UPDATE_TASK_SUCCESS, DELETE_TASK_SUCCESS } from '../actions/';

function tasks(state = [], action) {
    switch (action.type) {
        case LOAD_TASKS_SUCCESS: 
            return [...action.tasks]
        case CREATE_TASK_SUCCESS:
            return [...state, action.task]
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

export default function(state = { tasks: [], loaded: false }, action) {
    let loaded = state.loaded;

    if (action.type == LOAD_TASKS_SUCCESS) {
        loaded = true;
    }

    return {
        tasks: tasks(state.tasks, action),
        loaded: loaded
    }
}
