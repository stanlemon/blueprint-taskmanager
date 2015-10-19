import React from 'react';
import TaskForm from './TaskForm';
import * as taskAction from '../actions/';

export default class UpdateTaskForm extends TaskForm {

    handleSubmit(e) {
        e.preventDefault();

        TaskActions.updateTask(this.state);
    }
}
