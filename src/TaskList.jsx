import React from 'react';
import Reflux from 'reflux';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';
import TaskStore from './stores/TaskStore';

export default React.createClass({

    mixins: [
        Reflux.connect(TaskStore, "tasks")
    ],

    render() {
        return (
            <div>
                <h2>Tasks</h2>
                <ul>
                    {this.state.tasks.map((task) => {
                        return (
                            <TaskItem task={task}/>
                        )
                    })}
                </ul>

                <TaskForm/>
            </div>
        );
    }
});
