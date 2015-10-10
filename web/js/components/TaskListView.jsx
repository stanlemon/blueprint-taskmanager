import React from 'react';
import Reflux from 'reflux';
import TaskForm from './CreateTaskForm';
import TaskItem from './TaskItem';
import TaskStore from '../stores/TaskStore';

export default React.createClass({

    mixins: [
        Reflux.connect(TaskStore, "tasks")
    ],

    render() {
        return (
            <div>
                <table className="table table-bordered table-hover table-condensed">
                    <thead>
                        <tr>
                            <th className="col-md-11">Title</th>
                            <th className="col-md-1 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.tasks.map((task) => {
                        return (
                            <TaskItem task={task}/>
                        )
                    })}
                    </tbody>
                </table>

                <TaskForm/>
            </div>
        );
    }
});
