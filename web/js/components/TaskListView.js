import { includes } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import TaskForm from './CreateTaskForm';
import TaskItem from './TaskItem';

const ALL = 'all';
const INCOMPLETE = 'incomplete';
const COMPLETE = 'complete';

export default class TaskListView extends React.Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
        tasks: PropTypes.array.isRequired,
        errors: PropTypes.object,
        loaded: PropTypes.array,
    };

    static defaultProps = {
        actions: {},
        tasks: [],
        errors: {},
        loaded: [],
    };

    state = {
        filter: ALL,
    };

    setFilter(filter) {
        this.setState({ filter });
    }

    render() {
        const { filter } = this.state;
        const { actions, router, loaded, errors } = this.props;

        if (!includes(loaded, 'tasks')) {
            return (
                <div className="text-center">
                    <i
                        style={{ fontSize: '10em' }}
                        className="text-primary fa fa-refresh fa-spin"
                    />
                </div>
            );
        } else if (this.props.tasks.length === 0) {
            return (
                <div className="jumbotron">
                    <h1>You don't have any tasks!</h1>
                    <p>
                        Use the form below to get started and add your first
                        task.
                    </p>
                    <TaskForm actions={actions} errors={errors} />
                </div>
            );
        }
        const tasks = this.props.tasks.filter(task => {
            switch (this.state.filter) {
                case INCOMPLETE:
                    return task.completed === null;
                case COMPLETE:
                    return task.completed !== null;
                default:
                    return true;
            }
        });

        tasks
            .sort((a, b) => moment(a.createdAt).isAfter(b.createdAt))
            .sort((a, b) => {
                if (!a.due && !b.due) {
                    return 0;
                } else if (!a.due && b.due) {
                    return 1;
                } else if (a.due && !b.due) {
                    return -1;
                } else if (moment(a.due).isSame(b.due)) {
                    return 0;
                }
                return moment(a.due).isAfter(b.due) ? 1 : -1;
            })
            .sort((a, b) => {
                if (!a.completed && b.completed) {
                    return -1;
                } else if (a.completed && b.completed) {
                    return moment(a.completed).isAfter(b.completed) ? -1 : 1;
                }
                return 1;
            });

        const btnClasses = classNames(
            'btn',
            'btn-sm',
            'btn-info',
            'btn-default'
        );
        const btnAll = classNames(btnClasses, { active: filter === ALL });
        const btnIncomplete = classNames(btnClasses, {
            active: filter === INCOMPLETE,
        });
        const btnComplete = classNames(btnClasses, {
            active: filter === COMPLETE,
        });

        const style = {
            notasks: {
                border: '1px solid #e3e3e3',
                borderRadius: '4px',
                marginBottom: '8px',
            },
        };

        return (
            <div>
                <div className="col-xs-12 col-sm-5 pull-right">
                    <div className="btn-group btn-group-justified" role="group">
                        <div className="btn-group" role="group">
                            <button
                                type="button"
                                onClick={this.setFilter.bind(this, ALL)}
                                onTouchTap={this.setFilter.bind(this, ALL)}
                                className={btnAll}
                            >
                                All
                            </button>
                        </div>
                        <div className="btn-group" role="group">
                            <button
                                type="button"
                                onClick={this.setFilter.bind(this, INCOMPLETE)}
                                onTouchTap={this.setFilter.bind(
                                    this,
                                    INCOMPLETE
                                )}
                                className={btnIncomplete}
                            >
                                Incomplete
                            </button>
                        </div>
                        <div className="btn-group" role="group">
                            <button
                                type="button"
                                onClick={this.setFilter.bind(this, COMPLETE)}
                                onTouchTap={this.setFilter.bind(this, COMPLETE)}
                                className={btnComplete}
                            >
                                Complete
                            </button>
                        </div>
                    </div>
                </div>
                <div className="clearfix" />
                <div style={{ minHeight: 10 }} />

                {tasks.length === 0 &&
                    <div style={style.notasks}>
                        <div
                            className="text-center row"
                            style={{ margin: '10px' }}
                        >
                            <em>There are no tasks for this filter</em>
                        </div>
                    </div>}

                {tasks.map(task =>
                    <TaskItem
                        key={task.id}
                        actions={actions}
                        router={router}
                        task={task}
                    />
                )}

                <br />

                <TaskForm actions={actions} errors={errors} />
            </div>
        );
    }
}
