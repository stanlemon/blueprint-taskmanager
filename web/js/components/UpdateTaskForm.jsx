import React from 'react';
import TaskForm from './TaskForm';

export default class UpdateTaskForm extends TaskForm {

    static propTypes = {
        router: React.PropTypes.object,
    };

    handleSave(data) {
        this.props.actions.updateTask(data);
        this.props.router.push('/');
    }
}
