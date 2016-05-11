/* @flow weak */
import React from 'react';
import TaskForm from './TaskForm';

export default class UpdateTaskForm extends TaskForm {

    handleSave(data) {
        this.props.actions.updateTask(data);
        this.context.router.push('/');
    }
}

UpdateTaskForm.contextTypes = {
    router: React.PropTypes.object.isRequired,
};
