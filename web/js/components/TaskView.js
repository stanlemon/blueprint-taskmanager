import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import format from 'date-fns/format';
import React from 'react';
import PropTypes from 'prop-types';
import Error from './Error';
import UpdateTaskForm from './UpdateTaskForm';

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

    const handleReturnToList = () => this.props.navigateTo('/');

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
                {format(task.createdAt, 'MMMM do yyyy, h:mm:ssa')}
            </p>
            <p>
                <strong>Last Updated: </strong>
                {format(task.updatedAt, 'MMMM do yyyy, h:mm:ssa')}
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
