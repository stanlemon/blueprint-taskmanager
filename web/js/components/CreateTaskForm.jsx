import React from 'react';
import TaskForm from './TaskForm';

export default class CreateTaskForm extends TaskForm {

    handleSubmit(e) {
        e.preventDefault();
        
        this.props.actions.createTask(this.state);

        this.refs.taskName.value = '';
        this.refs.taskDescription.value = '';
    }
}
