/* @flow weak */
import React from 'react';
import TaskForm from './TaskForm';

export default class UpdateTaskForm extends TaskForm {

    handleSubmit(state) {
        this.props.actions.updateTask(state);
    }
}
