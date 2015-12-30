/* @flow weak */
import React from 'react';
import TaskForm from './TaskForm';

export default class CreateTaskForm extends TaskForm {

    handleSubmit(e) {
        e.preventDefault();
        
        this.props.actions.createTask(this.state);
        
        this.setState({
            name: '',
            description: ''
        });
    }
}
