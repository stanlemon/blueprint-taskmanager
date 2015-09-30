import React from 'react';
import { Link } from 'react-router';
import Reflux from 'reflux';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';
import TaskStore from '../stores/TaskStore';

export default React.createClass({

    mixins: [
        Reflux.connectFilter(TaskStore, "task", function(tasks) {
            let taskId = parseInt(this.props.params.id);

            return tasks.filter(function(task) {
                return task.id === taskId;
            })[0];
        })
    ],
    
    render() {
        let task = this.state.task;

        return (
            <div>
                <h2>{task.name}</h2>
                <p>{task.description}</p>
                <p><strong>Created:</strong> {task.createdAt}</p>
                <p><strong>Updated:</strong> {task.updatedAt}</p>

                <Link to="taskListView">Go back to list</Link>
            </div>
        );
    }
});
