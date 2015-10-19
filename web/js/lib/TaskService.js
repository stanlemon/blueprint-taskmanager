export default class TaskService {

    constructor(baseUrl = '/api/tasks') {
        this.baseUrl = baseUrl;
    }

    loadTasks(callback) {
        let url = this.baseUrl;

        return fetch(url);
    }

    createTask(task) {
        let url = this.baseUrl;

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
        let url = this.baseUrl + '/' + task.id;

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
        let url = this.baseUrl + '/' + taskId;

        return fetch(url, {
            method: 'delete',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }
}
