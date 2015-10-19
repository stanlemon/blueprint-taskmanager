export const LOAD_TASKS = 'LOAD_TASKS';
export const CREATE_TASK = 'CREATE_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';
export const DELETE_TASK = 'DELETE_TASK';

export function loadTasks() {
    return { type: LOAD_TASKS };
}

export function createTask(task) {
    return { type: CREATE_TASK, task: task };
}

export function updateTask(task) {
    return { type: UPDATE_TASK, task: task };
}

export function deleteTask(taskId) {
    return { type: DELETE_TASK, taskId: taskId };
}
