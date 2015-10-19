import { combineReducers } from 'redux';
import { LOAD_TASKS_SUCCESS, CREATE_TASK_SUCCESS, UPDATE_TASK_SUCCESS, DELETE_TASK_SUCCESS } from '../actions/';

function tasksReducer(state = [], action) {
    switch (action.type) {
        case LOAD_TASKS_SUCCESS: 
            return [...action.tasks]
        case CREATE_TASK_SUCCESS:
            return [...state, action.task]
        case UPDATE_TASK_SUCCESS:
            var tasks = [];
            state.forEach( val => {
                if (action.task.id == val.id) {
                    tasks.push(action.task);
                } else {
                    tasks.push(val);
                }
            })
            return tasks;
        case DELETE_TASK_SUCCESS:
            var tasks = [];
            state.forEach( val => {
                if (action.taskId != val.id) {
                    tasks.push(val);
                }
            })
            return tasks;
        default:
            return state;
    }
}

const tasksApp = combineReducers({
    tasks: tasksReducer
});

export default tasksApp;
