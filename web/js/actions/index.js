/* @flow weak */
import TaskService from '../lib/TaskService';

export const ERROR = 'ERROR';
export const AUTHENTICATED_USER = 'AUTHENTICATED_USER';
export const UNAUTHENTICATED_USER = 'UNAUTHENTICATED_USER';
export const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';
export const LOAD_TASKS_SUCCESS = 'LOAD_TASKS_SUCCESS';
export const LOAD_TASKS_ERROR = 'LOAD_TASKS_ERROR';
export const CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS';
export const CREATE_TASK_ERROR = 'CREATE_TASK_ERROR';
export const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';
export const UPDATE_TASK_ERROR = 'UPDATE_TASK_ERROR';
export const DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS';
export const DELETE_TASK_ERROR = 'DELETE_TASK_ERROR';

const taskService = new TaskService();

export function addError(error) {
    return { type: ERROR, errors: [error] };
}

export function addErrors(errors) {
    return { type: ERROR, errors };
}

export function loadUser(user) {
    if (user !== false) {
        return { type: AUTHENTICATED_USER, user };
    }
    return { type: UNAUTHENTICATED_USER };
}

export async function logout() {
    try {
        const response = await fetch('/logout', {
            credentials: 'same-origin'
        });
        await response.json();

        return { type: UNAUTHENTICATED_USER };
    } catch (error) {
        return { type: AUTHENTICATION_ERROR, errors: [error] };
    }
}

export async function loadTasks() {
    try {
        const response = await taskService.loadTasks();
        const tasks = await response.json();

        return { type: LOAD_TASKS_SUCCESS, tasks };
    } catch (error) {
        return { type: LOAD_TASKS_ERROR, errors: [error] };
    }
}

export async function createTask(data) {
    try {
        const response = await taskService.createTask(data);
        const task = await response.json();

        if (task.hasOwnProperty('errors') && Array.isArray(task.errors) && task.errors.length > 0) {
            return { type: CREATE_TASK_ERROR, errors: task.errors };
        }

        return { type: CREATE_TASK_SUCCESS, task };
    } catch (error) {
        return { type: CREATE_TASK_ERROR, errors: [error] };
    }
}

export async function updateTask(data) {
    try {
        const response = await taskService.updateTask(data);
        const task = await response.json();

        if (task.hasOwnProperty('errors') && Array.isArray(task.errors) && task.errors.length > 0) {
            return { type: UPDATE_TASK_ERROR, errors: task.errors };
        }

        return { type: UPDATE_TASK_SUCCESS, task };
    } catch (error) {
        return { type: UPDATE_TASK_ERROR, errors: [error] };
    }
}

export async function deleteTask(taskId) {
    try {
        const response = await taskService.deleteTask(taskId);
        await response.json();

        return { type: DELETE_TASK_SUCCESS, taskId };
    } catch (error) {
        return { type: DELETE_TASK_ERROR, errors: [error] };
    }
}
