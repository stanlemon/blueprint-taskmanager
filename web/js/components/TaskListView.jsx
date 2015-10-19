import React from 'react';
import TaskForm from './CreateTaskForm';
import TaskItem from './TaskItem';

export default class TaskListView extends React.Component {

    render() {
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
                    {this.props.tasks.map((task) => {
                        return (
                            <TaskItem key={task.id} actions={this.props.actions} history={this.props.history} task={task}/>
                        )
                    })}
                    </tbody>
                </table>

                <TaskForm actions={this.props.actions}/>
            </div>
        );
    }
}
