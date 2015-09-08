import React from 'react';
import { Link } from 'react-router';
import TaskForm from './TaskForm';

export default class TaskService {

    constructor(baseUrl = "/api/tasks") {
        this.baseUrl = baseUrl;
    }

    loadTasks(callback) {
        let url = this.baseUrl;

        fetch(url)
          .then(response => response.json())
          .then(callback)
          .catch(err => console.error(url, err.toString()))
        ;
    }

    createTask(task, callback) {
        let url = this.baseUrl;

        fetch(url, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        })
          .then(response => response.json())
          .then(callback)
          .catch(err => console.error(url, err.toString()))
        ;
    }

    updateTask(task, callback) {
        let url = this.baseUrl + '/' + task.id;

        fetch(url, {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        })
          .then(response => response.json())
          .then(callback)
          .catch(err => console.error(url, err.toString()))
        ;
    }

    deleteTask(taskId, callback) {
        let url = this.baseUrl + '/' + task.id;

        fetch(url, {
            method: 'delete',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
          .then(response => response.json())
          .then(callback)
          .catch(err => console.error(url, err.toString()))
        ;
    }
}
