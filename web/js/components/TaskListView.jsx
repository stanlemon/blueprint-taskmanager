import React from 'react';
import TaskForm from './CreateTaskForm';
import TaskItem from './TaskItem';

export default class TaskListView extends React.Component {

    render() {
        let { actions, history, loaded, tasks } = this.props;

        if (!loaded.has('tasks')) {
            return <div/>
        }

        if (tasks.length == 0) {
            return (
                <div>
                    <div className="jumbotron">
                        <h1>You don't have any tasks!</h1>
                        <p>Use the form below to get started and add your first task.</p>
                    </div>
                    <TaskForm actions={actions}/>
                </div>
            )
        }

        return (
            <div>
                <table className="table table-bordered table-hover table-condensed">
                    <thead>
                        <tr>
                            <th className="col-md-10">Title</th>
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

                <TaskForm actions={actions}/>
            </div>
        );
    }
}
