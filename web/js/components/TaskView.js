import { includes, isEmpty } from 'lodash';
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import Error from './Error';
import TaskForm from './UpdateTaskForm';

export default function TaskView({
    actions,
    loaded,
    taskId,
    tasks,
    navigateTo,
    errors,
}) {
    if (!includes(loaded, 'tasks')) {
        return <div />;
    }

    const task = Object.assign({}, tasks.filter(t => t.id === taskId)[0]);

    if (isEmpty(task)) {
        return (
            <div>
                <Error message="Task does not exist." />
                <button
                    className="btn btn-link"
                    onClick={this.props.navigateTo('/')}
                >
                    Go back to list
                </button>
            </div>
        );
    }

    return (
        <div>
            <TaskForm
                task={task}
                errors={errors}
                navigateTo={navigateTo}
                actions={actions}
            />

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
    navigateTo: PropTypes.func.isRequired,
    taskId: PropTypes.number.isRequired,
    tasks: PropTypes.array.isRequired,
    errors: PropTypes.object,
    loaded: PropTypes.array,
};

TaskView.defaultProps = {
    actions: {},
    errors: {},
    loaded: [],
    tasks: [],
};
