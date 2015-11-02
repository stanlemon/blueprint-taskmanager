import React from 'react';
import classNames from 'classnames';
import TaskForm from './CreateTaskForm';
import TaskItem from './TaskItem';

const ALL = 'all';
const INCOMPLETE = 'incomplete';
const COMPLETE = 'complete';

export default class TaskListView extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            filter: ALL
        }
    }

    setFilter(filter) {
        this.setState({
            filter: filter
        });
    }

    render() {
        let { filter } = this.state;
        let { actions, history, loaded } = this.props;
        let tasks = this.props.tasks.filter( task => {
            switch (this.state.filter) {
                case ALL:
                    return true;
                case INCOMPLETE:
                    return task.completed === null;
                case COMPLETE:
                    return task.completed !== null;
            }
        });

        if (!loaded.has('tasks')) {
            return <div/>
        }

        let taskList;

        if (tasks.length == 0) {
            taskList = (
                <div>
                    <div className="jumbotron">
                        <h1>You don't have any tasks!</h1>
                        <p>Use the form below to get started and add your first task.</p>
                    </div>
                    <TaskForm actions={actions}/>
                </div>
            )
        } else {
            taskList = (
                <table className="table table-bordered table-hover table-condensed">
                    <thead>
                        <tr>
                            <th className="col-md-9">Title</th>
                            <th className="col-md-1"></th>
                            <th className="col-md-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {tasks.map((task) => {
                        return (
                            <TaskItem key={task.id} actions={actions} history={history} task={task}/>
                        )
                    })}
                    </tbody>
                </table>
            )
        }

        let btnClasses    = classNames('btn', 'btn-sm', 'btn-info', 'btn-default');
        let btnAll        = classNames(btnClasses, { active: filter == ALL });
        let btnIncomplete = classNames(btnClasses, { active: filter == INCOMPLETE });
        let btnComplete   = classNames(btnClasses, { active: filter == COMPLETE });

        return (
            <div>
                <div className="pull-right" style={{ width: 400 }}>
                    <div className="btn-group btn-group-justified" role="group">
                      <div className="btn-group" role="group">
                        <button type="button" onClick={this.setFilter.bind(this, ALL)} className={btnAll}>All</button>
                      </div>
                      <div className="btn-group" role="group">
                        <button type="button" onClick={this.setFilter.bind(this, INCOMPLETE)} className={btnIncomplete}>Incomplete</button>
                      </div>
                      <div className="btn-group" role="group">
                        <button type="button" onClick={this.setFilter.bind(this, COMPLETE)} className={btnComplete}>Complete</button>
                      </div>
                    </div>
                </div>
                <div className="clearfix"></div>
                <div style={{ minHeight: 10 }}></div>

                {taskList}

                <TaskForm actions={actions}/>
            </div>
        );
    }
}
