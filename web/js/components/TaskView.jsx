import React from 'react';
import { Link } from 'react-router';
import Reflux from 'reflux';
import Error from './Error';
import TaskForm from './UpdateTaskForm';
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
        if (undefined === this.state.task) {
            return (
                <Error message="Task does not exist."/>
            )
        }

        let task = this.state.task;

        return (
            <div>
                <TaskForm {...task}/>

                <p><strong>Created:</strong> {task.createdAt}</p>
                <p><strong>Updated:</strong> {task.updatedAt}</p>

                <Link to="taskListView">Go back to list</Link>
            </div>
        );
    }
});
