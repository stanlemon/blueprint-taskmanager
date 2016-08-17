import RestService from './RestService';

export default class TaskService extends RestService {

    formatTask(task) {
        return Object.assign({}, task, {
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
            completed: task.completed ? new Date(task.completed) : null,
            due: task.due ? new Date(task.due) : null,
        });
    }

    loadTasks() {
        return this.fetch(`${this.baseUrl}/api/tasks/`)
            .then(data => data.map((task) => this.formatTask(task)))
        ;
    }

    createTask(task) {
        return this.fetch(`${this.baseUrl}/api/tasks/`, 'post', task)
            .then(data => this.formatTask(data))
        ;
    }

    updateTask(task) {
        return this.fetch(`${this.baseUrl}/api/tasks/${task.id}`, 'put', task)
            .then(data => this.formatTask(data))
        ;
    }

    deleteTask(taskId) {
        return this.fetch(`${this.baseUrl}/api/tasks/${taskId}`, 'delete');
    }
}
