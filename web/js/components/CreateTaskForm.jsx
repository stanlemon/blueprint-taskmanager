/* @flow weak */
import { isEqual } from 'lodash';
import React from 'react';
import TaskForm from './TaskForm';

export default class CreateTaskForm extends TaskForm {

    handleSubmit(errors, data) {
        if (isEqual({}, errors) === false) {
            this.props.actions.addErrors(Object.keys(errors).map((field) => {
                return { field, message: errors[field].slice(0,1)[0] };
            }));
        } else {
            this.props.actions.createTask(data);
            return {}
        }
    }
}
