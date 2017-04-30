import React from 'react';
import PropTypes from 'prop-types';
import TaskForm from './TaskForm';

export default class UpdateTaskForm extends TaskForm {

    static propTypes = {
        router: PropTypes.object,
    };

    handleSave(data) {
        this.props.actions.updateTask(data);
        this.props.router.push('/');
    }
}
