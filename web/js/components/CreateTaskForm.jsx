import React from 'react';
import TaskForm from './TaskForm';
import * as taskAction from '../actions/';

export default class CreateTaskForm extends TaskForm {

    handleSubmit(e) {
        e.preventDefault();

        TaskActions.createTask(this.state);

        this.setState({
            name: '',
            description: ''
        });
    }
}
