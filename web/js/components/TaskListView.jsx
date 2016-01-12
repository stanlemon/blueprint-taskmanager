/* @flow weak */
import { contains } from 'lodash';
import React from 'react';
import classNames from 'classnames';
import TaskForm from './CreateTaskForm';
import TaskItem from './TaskItem';

const ALL = 'all';
const INCOMPLETE = 'incomplete';
const COMPLETE = 'complete';

export default class TaskListView extends React.Component {

    setFilter(filter) {
        this.setState({ filter });
    }

    componentWillMount() {
        this.setState({ filter: ALL });
    }

    render() {
        const { filter } = this.state;
        const { actions, history, loaded, errors } = this.props;

        if (!contains(loaded, 'tasks')) {
            return (
                <div className="text-center">
                    <i style={{ fontSize: '10em' }} className="text-primary fa fa-refresh fa-spin"></i>
                </div>
            )
        } else if (this.props.tasks.length == 0) {
            return (
                <div className="jumbotron">
                    <h1>You don't have any tasks!</h1>
                    <p>Use the form below to get started and add your first task.</p>
                    <TaskForm actions={actions} errors={errors}/>
                </div>
            )
        } else {
            const tasks = this.props.tasks.filter( task => {
                switch (this.state.filter) {
                    case INCOMPLETE:
                        return task.completed === null;
                    case COMPLETE:
                        return task.completed !== null;
                    default:
                        return true;
                }
            });

            const btnClasses    = classNames('btn', 'btn-sm', 'btn-info', 'btn-default');
            const btnAll        = classNames(btnClasses, { active: filter == ALL });
            const btnIncomplete = classNames(btnClasses, { active: filter == INCOMPLETE });
            const btnComplete   = classNames(btnClasses, { active: filter == COMPLETE });

            return (
                <div>
                    <div className="col-xs-12 col-sm-5 pull-right">
                        <div className="btn-group btn-group-justified" role="group">
                            <div className="btn-group" role="group">
                                <button type="button"
                                    onTouchTap={this.setFilter.bind(this, ALL)}
                                    className={btnAll}>All</button>
                            </div>
                            <div className="btn-group" role="group">
                                <button type="button"
                                    onTouchTap={this.setFilter.bind(this, INCOMPLETE)}
                                    className={btnIncomplete}>Incomplete</button>
                            </div>
                            <div className="btn-group" role="group">
                                <button type="button"
                                    onTouchTap={this.setFilter.bind(this, COMPLETE)}
                                    className={btnComplete}>Complete</button>
                            </div>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div style={{ minHeight: 10 }}></div>

                    {tasks.length === 0 && (
                        <div style={{ border: '1px solid #e3e3e3', borderRadius: '4px', marginBottom: '8px' }}>
                            <div className="text-center row" style={{ margin: '10px' }}>
                                <em>There are no tasks for this filter</em>
                            </div>
                        </div>
                    )}

                    {tasks.map((task) => {
                        return (
                            <TaskItem key={task.id} actions={actions} history={history} task={task}/>
                        )
                    })}

                    <br />

                    <TaskForm actions={actions} errors={errors}/>
                </div>
            );
        }
    }
}
