import { mapErrors } from '../lib/Utils';

class TaskServiceException {
    errors = {};

    constructor(errors = {}) {
        this.errors = errors;
    }
}

export default class TaskService {

    baseUrl = '/api/tasks';

    formatTask(task) {
        return Object.assign({}, task, {
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
            completed: task.completed ? new Date(task.completed) : null,
            due: task.due ? new Date(task.due) : null,
        });
    }

    hasError(response) {
        return response.hasOwnProperty('errors')
            && Array.isArray(response.errors)
            && response.errors.length > 0
        ;
    }

    checkForErrors(response) {
        if (this.hasError(response)) {
            throw new TaskServiceException(mapErrors(response));
        }

        return response;
    }

    loadTasks() {
        const url = this.baseUrl;

        return fetch(url, {
            credentials: 'same-origin',
        })
            .then(response => response.json())
            .then(data => this.checkForErrors(data))
            .then(data => data.map((task) => this.formatTask(task)))
        ;
    }

    createTask(task) {
        const url = this.baseUrl;

        return fetch(url, {
            credentials: 'same-origin',
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        })
            .then(response => response.json())
            .then(data => this.checkForErrors(data))
            .then(data => this.formatTask(data))
        ;
    }

    updateTask(task) {
        const url = `${this.baseUrl}/${task.id}`;

        return fetch(url, {
            credentials: 'same-origin',
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        })
            .then(response => response.json())
            .then(data => this.checkForErrors(data))
            .then(data => this.formatTask(data))
        ;
    }

    deleteTask(taskId) {
        const url = `${this.baseUrl}/${taskId}`;

        return fetch(url, {
            credentials: 'same-origin',
            method: 'delete',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => this.checkForErrors(data))
        ;
    }
}
