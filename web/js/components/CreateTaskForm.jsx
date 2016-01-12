/* @flow weak */
import { isEqual } from 'lodash';
import React from 'react';
import TaskForm from './TaskForm';

export default class CreateTaskForm extends TaskForm {

    handleSubmit(errors, data) {
        if (isEqual({}, errors) === false) {
            this.props.actions.addErrors(errors);
        } else {
            this.props.actions.createTask(data);
            return {}
        }
    }
}
