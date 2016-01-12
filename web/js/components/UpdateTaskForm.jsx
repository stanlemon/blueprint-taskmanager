/* @flow weak */
import { isEqual, isDate } from 'lodash';
import React from 'react';
import TaskForm from './TaskForm';
import { makeDateTime } from '../lib/Utils';

export default class UpdateTaskForm extends TaskForm {

    handleSave(data) {
        this.props.actions.updateTask(data);
    }
}
