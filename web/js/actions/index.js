import TaskService from '../lib/TaskService';

export const LOAD_TASKS = 'LOAD_TASKS';
export const LOAD_TASKS_SUCCESS = 'LOAD_TASKS_SUCCESS';
export const LOAD_TASKS_ERROR = 'LOAD_TASKS_ERROR';
export const CREATE_TASK = 'CREATE_TASK';
export const CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS';
export const CREATE_TASK_ERROR = 'CREATE_TASK_ERROR';
export const UPDATE_TASK = 'UPDATE_TASK';
export const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';
export const UPDATE_TASK_ERROR = 'UPDATE_TASK_ERROR';
export const DELETE_TASK = 'DELETE_TASK';
export const DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS';
export const DELETE_TASK_ERROR = 'DELETE_TASK_ERROR';

const taskService = new TaskService();

export function loadTasks() {
    return dispatch => {
        return taskService.loadTasks()
            .then(response => response.json())
            .then(tasks => dispatch({ type: LOAD_TASKS_SUCCESS, tasks: tasks }))
            .catch(error => dispatch({ type: LOAD_TASKS_ERROR, error: error }))
    }
}

export function createTask(task) {
    return dispatch => {
        return taskService.createTask(task)
            .then(response => response.json())
            .then(task => dispatch({ type: CREATE_TASK_SUCCESS, task: task }))
            .catch(error => dispatch({ type: CREATE_TASK_ERROR, error: error }))
    }
}

export function updateTask(task) {
    return dispatch => {
        return taskService.updateTask(task)
            .then(response => response.json())
            .then(task => dispatch({ type: UPDATE_TASK_SUCCESS, task: task }))
            .catch(error => dispatch({ type: UPDATE_TASK_ERROR, error: error }))
    }
}

export function deleteTask(taskId) {
    return dispatch => {
        return taskService.deleteTask(taskId)
            .then(response => response.json())
            .then(task => dispatch({ type: DELETE_TASK_SUCCESS, taskId: taskId }))
            .catch(error => dispatch({ type: DELETE_TASK_ERROR, error: error }))
    }
}
