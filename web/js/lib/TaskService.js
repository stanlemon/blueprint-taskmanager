import 'whatwg-fetch';

export type Task = {
    id: number;
    name: string;
    description: string;
}

export class TaskService {

    constructor(baseUrl: string = '/api/tasks') {
        this.baseUrl = baseUrl;
    }

    loadTasks(): Promise{
        let url = this.baseUrl;

        return fetch(url);
    }

    createTask(task: Task): Promise {
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

    updateTask(task: Task): Promise {
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

    deleteTask(taskId: number): Promise {
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
