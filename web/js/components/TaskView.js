import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import format from 'date-fns/format';
import React from 'react';
import PropTypes from 'prop-types';
import Error from './Error';
import UpdateTaskForm from './UpdateTaskForm';
import { DATE_FORMAT_LONG } from '../lib/Utils';

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

    const handleReturnToList = () => navigateTo('/');

    const task = Object.assign({}, tasks.filter(t => t.id === taskId)[0]);

    if (isEmpty(task)) {
        return (
            <div>
                <Error message="Task does not exist." />
                <button className="btn btn-link" onClick={handleReturnToList}>
                    Go back to list
                </button>
            </div>
        );
    }

    return (
        <div>
            <UpdateTaskForm
                task={task}
                errors={errors}
                navigateTo={navigateTo}
                actions={actions}
            />

            <p>
                <strong>Created: </strong>
                <span>{format(task.createdAt, DATE_FORMAT_LONG)}</span>
            </p>
            <p>
                <strong>Last Updated: </strong>
                <span>{format(task.updatedAt, DATE_FORMAT_LONG)}</span>
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
