import React from 'react';
import { Link } from 'react-router';
import Reflux from 'reflux';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';
import TaskStore from './stores/TaskStore';

export default React.createClass({

    mixins: [
        Reflux.listenTo(TaskStore,'onLoadTask')
        //Reflux.connect(TaskStore, "task")
    ],
    
    onLoadTask(task) {
        console.log('component loadTask');
        this.setState({ task: task });
    },
    
    render() {
        let task = this.state.task;

        return (
            <div>
                <h2>{task.name}</h2>
                <p>{task.description}</p>
                <p><strong>Created:</strong> {task.createdAt}</p>
                <p><strong>Updated:</strong> {task.updatedAt}</p>

                <Link to="taskList">Go back to list</Link>
            </div>
        );
    }
});
