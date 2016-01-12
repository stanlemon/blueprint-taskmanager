/* @flow weak */
import { isEqual, isDate } from 'lodash';
import React from 'react';
import TaskForm from './TaskForm';
import { makeDateTime } from '../lib/Utils';

export default class CreateTaskForm extends TaskForm {

    handleSave(data) {
        this.props.actions.createTask(data);
        return {}
    }
}
