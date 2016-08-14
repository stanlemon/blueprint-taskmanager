import { includes } from 'lodash';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';
import Error from './Error';
import TaskForm from './UpdateTaskForm';

export default function TaskView({ params, actions, router, loaded, tasks, errors }) {
    if (!includes(loaded, 'tasks')) {
        return <div />;
    }

    const taskId = parseInt(params.id, 10);
    const task = Object.assign({}, tasks.filter(t => t.id === taskId)[0]);

    if (!task) {
        return (
            <div>
                <Error message="Task does not exist." />
                <Link to="/">Go back to list</Link>
            </div>
        );
    }

    return (
        <div>
            <TaskForm task={task} errors={errors} router={router} actions={actions} />

            <p>
                <strong>Created: </strong>
                {moment(task.createdAt).format('MMMM Do YYYY, h:mm:ssa')}
            </p>
            <p>
                <strong>Last Updated: </strong>
                {moment(task.updatedAt).format('MMMM Do YYYY, h:mm:ssa')}
            </p>
        </div>
    );
}

TaskView.propTypes = {
    children: React.PropTypes.node,
    actions: React.PropTypes.object,
    router: React.PropTypes.object,
    params: React.PropTypes.object,
    tasks: React.PropTypes.array,
    errors: React.PropTypes.object,
    loaded: React.PropTypes.array,
};
