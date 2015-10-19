import React from 'react';
import TaskForm from './CreateTaskForm';
import TaskItem from './TaskItem';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/';

@connect( state => ({ tasks: state.tasks }) )
export default class App extends React.Component {

    render() {
        let boundActions = bindActionCreators(actions, this.props.dispatch);

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
                            <TaskItem actions={boundActions} key={task.id} task={task}/>
                        )
                    })}
                    </tbody>
                </table>

                <TaskForm actions={boundActions}/>
            </div>
        );
    }
}
