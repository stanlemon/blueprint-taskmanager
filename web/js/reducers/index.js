import { combineReducers } from 'redux';
import { LOAD_TASKS, CREATE_TASK, UPDATE_TASK, DELETE_TASK } from '../actions/';

function tasksReducer(state = [], action) {
    switch (action.type) {
        case CREATE_TASK:
            action.task.id = state.length;
            return [...state, action.task]
        case UPDATE_TASK:
            var tasks = [];
            state.forEach( val => {
                if (action.task.id == val.id) {
                    tasks.push(action.task);
                } else {
                    tasks.push(val);
                }
            })
            return tasks;
        case DELETE_TASK:
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
