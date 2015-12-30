/* @flow weak */
import React from 'react';
import TaskForm from './TaskForm';

export default class UpdateTaskForm extends TaskForm {

    handleSubmit(e) {
        e.preventDefault();

        this.props.actions.updateTask(this.state);
    }
}
