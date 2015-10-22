import React from 'react';
import { Link } from 'react-router';
import Error from './Error';
import TaskForm from './UpdateTaskForm';
import TaskItem from './TaskItem';

export default class TaskView extends React.Component {

    render() {
        if (!this.props.loaded) {
            return <div/>
        }

        let taskId = parseInt(this.props.params.id);
        
        let task = this.props.tasks.filter(function(task) {
            return task.id === taskId;
        })[0];
    
        if (this.props.loaded && undefined === task) {
            return (
                <div>
                    <Error message="Task does not exist."/>
                    <Link to="/">Go back to list</Link>
                </div>
            )
        }

        return (
            <div>
                <TaskForm actions={this.props.actions} {...task}/>

                <p><strong>Created:</strong> {task.createdAt}</p>
                <p><strong>Updated:</strong> {task.updatedAt}</p>

                <Link to="/">Go back to list</Link>
            </div>
        );
    }
}
