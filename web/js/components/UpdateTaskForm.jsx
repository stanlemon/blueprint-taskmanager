/* @flow weak */
import React from 'react';
import TaskForm from './TaskForm';

export default class UpdateTaskForm extends TaskForm {

    handleSubmit(errors, data) {
        if (Object.is({}, errors)) {
            console.log("errors!", errors);
            this.props.actions.addErrors(Object.keys(errors).map((field) => {
                return { field, message: errors[field].slice(0,1)[0] };
            }));
        } else {
            this.props.actions.updateTask(data);
        }
    }
}
