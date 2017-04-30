import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { makeDateTime } from '../lib/Utils';

export default class TaskItem extends React.Component {

    static propTypes = {
        router: PropTypes.object,
        children: PropTypes.node,
        actions: PropTypes.object,
        task: PropTypes.object,
        errors: PropTypes.array,
    };

    deleteTask() {
        this.props.actions.deleteTask(this.props.task.id);
    }

    viewTask() {
        this.props.router.push(`/view/${this.props.task.id}`);
    }

    completeTask(event) {
        const checked = event.target.checked;
        this.props.actions.updateTask(
            Object.assign({}, this.props.task, {
                completed: checked ? makeDateTime() : null,
            })
        );
    }

    render() {
        const { task } = this.props;

        const rowStyles = {
            cursor: 'pointer',
            border: '1px solid #e3e3e3',
            borderRadius: '4px',
            marginBottom: '8px',
        };

        const nameStyles = {
            textDecoration: task.completed ? 'line-through' : 'none',
        };

        const rowClasses = classNames({
            // Tasks due in the next day
            'bg-warning': task.due
                 && !task.completed
                 && moment(task.due).isAfter(moment().subtract(2, 'days')),
            // Tasks that are are over due
            'bg-danger': task.due
                 && !task.completed
                 && moment(task.due).isBefore(moment()),
        });

        return (
            <div style={rowStyles} className={rowClasses}>
                <div className="row" style={{ margin: '10px' }}>
                    <div
                      style={nameStyles}
                      className="task-name col-xs-9 col-sm-9 col-md-10"
                      onClick={this.viewTask.bind(this)}
                      onTouchTap={this.viewTask.bind(this)}
                    >
                        {task.name}
                    </div>
                    <div className="col-xs-3 col-sm-3 col-md-2">
                        <div className="row">
                            <div className="col-xs-6 col-sm-6 text-right">
                                <input
                                  type="checkbox"
                                  checked={this.props.task.completed !== null}
                                  onChange={this.completeTask.bind(this)}
                                />
                            </div>
                            <div className="col-xs-6 col-sm-6 text-right">
                                <button
                                  type="button"
                                  className="btn btn-xs btn-danger"
                                  onClick={this.deleteTask.bind(this)}
                                  onTouchTap={this.deleteTask.bind(this)}
                                >
                                    <i className="fa fa-trash-o" style={{ padding: '3px' }} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
