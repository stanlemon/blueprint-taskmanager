/* @flow weak */
export default class TaskService {

    baseUrl = '/api/tasks';

    constructor(baseUrl = '/api/tasks') {
        this.baseUrl = baseUrl;
    }

    loadTasks() {
        const url = this.baseUrl;

        return fetch(url);
    }

    createTask(task) {
        const url = this.baseUrl;

        return fetch(url, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
    }

    updateTask(task) {
        const url = this.baseUrl + '/' + task.id;

        return fetch(url, {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
    }

    deleteTask(taskId) {
        const url = this.baseUrl + '/' + taskId;

        return fetch(url, {
            method: 'delete',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }
}
