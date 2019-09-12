import React from 'react';
import PropTypes from 'prop-types';
import TaskForm from './TaskForm';

export default class CreateTaskForm extends React.Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        navigateTo: PropTypes.func,
    };

    constructor(props) {
        super(props);
    }

    handleSave = data => {
        this.props.actions.createTask(data);
        // Return a blank task
        return Object.assign({}, TaskForm.defaultProps.task);
    };

    render() {
        return (
            <TaskForm
                className="task-create-form"
                navigateTo={this.props.navigateTo}
                actions={this.props.actions}
                save={this.handleSave}
            />
        );
    }
}
