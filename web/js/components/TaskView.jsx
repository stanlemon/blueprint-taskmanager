import { includes } from 'lodash';
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
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
    actions: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    tasks: PropTypes.array.isRequired,
    errors: PropTypes.object,
    loaded: PropTypes.array,
};

TaskView.defaultProps = {
    errors: {},
    loaded: [],
};
