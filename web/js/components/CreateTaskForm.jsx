import React from 'react';
import TaskForm from './TaskForm';
import TaskActions from '../actions/TaskActions';

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
