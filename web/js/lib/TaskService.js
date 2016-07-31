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

    fetch(url, method = 'get', data = null) {
        const options = {
            credentials: 'same-origin',
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        return fetch(url, options)
            .then(response => response.json())
            .then(response => this.checkForErrors(response))
        ;
    }

    loadTasks() {
        return this.fetch(this.baseUrl)
            .then(data => data.map((task) => this.formatTask(task)))
        ;
    }

    createTask(task) {
        return this.fetch(this.baseUrl, 'post', task)
            .then(data => this.formatTask(data))
        ;
    }

    updateTask(task) {
        return this.fetch(`${this.baseUrl}/${task.id}`, 'put', task)
            .then(data => this.formatTask(data))
        ;
    }

    deleteTask(taskId) {
        return this.fetch(`${this.baseUrl}/${taskId}`, 'delete');
    }
}
