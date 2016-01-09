/* @flow weak */
import React from 'react';
import TaskForm from './TaskForm';

export default class CreateTaskForm extends TaskForm {

    handleSubmit(state) {
        this.props.actions.createTask(state);
        return {}
    }
}
