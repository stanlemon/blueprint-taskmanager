/* @flow weak */
import { contains } from 'lodash';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';
import Error from './Error';
import TaskForm from './UpdateTaskForm';
import TaskItem from './TaskItem';

export default class TaskView extends React.Component {

    render() {
        let { params, actions, history, loaded, tasks, errors } = this.props;

        if (!contains(loaded, 'tasks')) {
            return <div/>
        }

        let taskId = parseInt(params.id);
        let task = tasks.filter( task => task.id === taskId )[0];
    
        if (!task) {
            return (
                <div>
                    <Error message="Task does not exist."/>
                    <Link to="/">Go back to list</Link>
                </div>
            )
        }

        return (
            <div>
                <TaskForm task={task} errors={errors} history={history} actions={actions}/>

                <p>
                    <strong>Created:</strong> {moment(task.createdAt).format('MMMM Do YYYY, h:mm:ssa')}
                </p>
                <p>
                    <strong>Last Updated:</strong> {moment(task.updatedAt).format('MMMM Do YYYY, h:mm:ssa')}
                </p>
            </div>
        );
    }
}
