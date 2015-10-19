import React from 'react';
import TaskForm from './CreateTaskForm';
import TaskItem from './TaskItem';
import { connect } from 'react-redux';

@connect( state => ({ tasks: state.tasks }) )
export default class App extends React.Component {

    render() {
    console.log(this.props.tasks);
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
                    {this.props.tasks.map((task) => {
                        return (
                            <TaskItem key={task.id} task={task}/>
                        )
                    })}
                    </tbody>
                </table>

                <TaskForm/>
            </div>
        );
    }
}
