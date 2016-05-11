/* @flow weak */
import { makeDateTime } from '../lib/Utils';
import classNames from 'classnames';
import React from 'react';
import moment from 'moment';

export default class TaskItem extends React.Component {

    constructor() {
        super();
        this.deleteTask = this.deleteTask.bind(this);
        this.viewTask = this.viewTask.bind(this);
        this.completeTask = this.completeTask.bind(this);
    }

    deleteTask() {
        this.props.actions.deleteTask(this.props.task.id);
    }

    viewTask() {
        this.context.router.push(`/view/${this.props.task.id}`);
    }

    completeTask() {
        return {
            value: this.props.task.completed !== null,
            requestChange: (checked) => {
                this.props.actions.updateTask({
                    ...this.props.task,
                    completed: checked ? makeDateTime() : null
                });
            }
        };
    }

    render() {
        const { task } = this.props;

        const rowStyles = {
            cursor: 'pointer',
            border: '1px solid #e3e3e3',
            borderRadius: '4px',
            marginBottom: '8px'
        };

        const nameStyles = {
            textDecoration: task.completed ? 'line-through' : 'none'
        };

        const rowClasses = classNames({
            // Tasks due in the next day
            'bg-warning': task.due
                 && !task.completed
                 && moment(task.due).isAfter(moment().subtract(2, 'days')),
            // Tasks that are are over due
            'bg-danger': task.due
                 && !task.completed
                 && moment(task.due).isBefore(moment())
        });

        return (
            <div style={rowStyles} className={rowClasses}>
                <div className="row" style={{ margin: '10px' }}>
                    <div style={nameStyles}
                        className="col-xs-9 col-sm-9 col-md-10"
                        onTouchTap={ this.viewTask }
                    >
                        {task.name}
                    </div>
                    <div className="col-xs-3 col-sm-3 col-md-2">
                        <div className="row">
                            <div className="col-xs-6 col-sm-6 text-right">
                                <input type="checkbox" checkedLink={ this.completeTask() } />
                            </div>
                            <div className="col-xs-6 col-sm-6 text-right">
                                <button type="button"
                                    className="btn btn-xs btn-danger"
                                    onTouchTap={ this.deleteTask }
                                >
                                    <i className="fa fa-trash-o" style={{ padding: '3px' }}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

TaskItem.propTypes = {
    children: React.PropTypes.node,
    actions: React.PropTypes.object,
    history: React.PropTypes.object,
    task: React.PropTypes.object,
    errors: React.PropTypes.array,
};

TaskItem.contextTypes = {
    router: React.PropTypes.object.isRequired,
};
