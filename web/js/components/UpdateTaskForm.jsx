import React from 'react/addons';
import TaskForm from './TaskForm';
import TaskActions from '../actions/TaskActions';

export default class UpdateTaskForm extends TaskForm {

    handleSubmit(e) {
        e.preventDefault();

        TaskActions.updateTask(this.state);
    }
}
