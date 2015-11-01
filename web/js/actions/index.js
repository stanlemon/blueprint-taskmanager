import { TaskService, Task } from '../lib/TaskService';

export const ERROR                  = 'ERROR';
export const AUTHENTICATED_USER     = 'AUTHENTICATED_USER';
export const UNAUTHENTICATED_USER   = 'UNAUTHENTICATED_USER';
export const AUTHENTICATION_ERROR   = 'AUTHENTICATION_ERROR';
export const LOAD_TASKS_SUCCESS     = 'LOAD_TASKS_SUCCESS';
export const LOAD_TASKS_ERROR       = 'LOAD_TASKS_ERROR';
export const CREATE_TASK_SUCCESS    = 'CREATE_TASK_SUCCESS';
export const CREATE_TASK_ERROR      = 'CREATE_TASK_ERROR';
export const UPDATE_TASK_SUCCESS    = 'UPDATE_TASK_SUCCESS';
export const UPDATE_TASK_ERROR      = 'UPDATE_TASK_ERROR';
export const DELETE_TASK_SUCCESS    = 'DELETE_TASK_SUCCESS';
export const DELETE_TASK_ERROR      = 'DELETE_TASK_ERROR';

const taskService = new TaskService();

export function error(error) {
    return { type: ERROR, error: error };
}

export function loadUser(user) {
    if (user !== false) {
        return { type: AUTHENTICATED_USER, user: user };
    } else {
        return { type: UNAUTHENTICATED_USER };
    }
}

export async function logout(): { type: string } {
    try {
        let response = await fetch('/logout');
        let data = await response.json();

        return { type: UNAUTHENTICATED_USER };
    } catch (error) {
        console.log(error);
        return { type: AUTHENTICATION_ERROR, error: error };
    }
}

export async function loadTasks(): { type: string } {
    try {
        let response = await taskService.loadTasks();
        let tasks: Array<Task> = await response.json();

        return { type: LOAD_TASKS_SUCCESS, tasks: tasks };
    } catch (error) {
        return { type: LOAD_TASKS_ERROR, error: error };
    }
}

export async function createTask(task: Task): { type: string } {
    try {
        let response = await taskService.createTask(task);
        let data: Task = await response.json();

        return { type: CREATE_TASK_SUCCESS, task: data };
    } catch (error) {
        return { type: CREATE_TASK_ERROR, error: error };
    }
}

export async function updateTask(task: Task): { type: string } {
    try {
        let response = await taskService.updateTask(task);
        let data: Task = await response.json();

        return { type: UPDATE_TASK_SUCCESS, task: data };
    } catch (error) {
        return { type: UPDATE_TASK_ERROR, error: error };
    }
}

export async function deleteTask(taskId: number): { type: string } {
    try {
        let response = await taskService.deleteTask(taskId);
        let data = await response.json();

        return { type: DELETE_TASK_SUCCESS, taskId: taskId };
    } catch (error) {
        console.log(error);
        return { type: DELETE_TASK_ERROR, error: error };
    }
}
