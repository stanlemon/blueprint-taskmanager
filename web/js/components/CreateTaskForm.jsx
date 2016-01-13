/* @flow weak */
import React from 'react';
import TaskForm from './TaskForm';

export default class CreateTaskForm extends TaskForm {

    handleSave(data) {
        this.props.actions.createTask(data);
        return {}
    }
}
