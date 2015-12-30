/* @flow weak */
import React from 'react';
import { Link } from 'react-router';
import Error from './Error';
import TaskForm from './UpdateTaskForm';
import TaskItem from './TaskItem';

export default class TaskView extends React.Component {

    render() {
        let { params, actions, loaded, tasks } = this.props;

        if (!loaded) {
            return <div/>
        }

        let taskId = parseInt(params.id);
        let task = tasks.filter( task => task.id === taskId )[0];
    
        if (loaded && undefined === task) {
            return (
                <div>
                    <Error message="Task does not exist."/>
                    <Link to="/">Go back to list</Link>
                </div>
            )
        }

        return (
            <div>
                <TaskForm actions={actions} {...task}/>

                <p><strong>Created:</strong> {task.createdAt}</p>
                <p><strong>Updated:</strong> {task.updatedAt}</p>

                <Link to="/">Go back to list</Link>
            </div>
        );
    }
}
