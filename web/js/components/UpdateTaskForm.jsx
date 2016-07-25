/* @flow weak */
import React from 'react';
import TaskForm from './TaskForm';

export default class UpdateTaskForm extends TaskForm {

    handleSave(data) {
        this.props.actions.updateTask(data);
        this.props.router.push('/');
    }
}

UpdateTaskForm.propTypes = {
    router: React.PropTypes.object,
};
