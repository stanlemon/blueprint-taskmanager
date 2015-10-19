import React from 'react';
import { Link } from 'react-router';
import Error from './Error';
import TaskForm from './UpdateTaskForm';
import TaskItem from './TaskItem';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/';

@connect( state => ({ tasks: state.tasks }) )
export default class App extends React.Component {

    render() {
        let boundActions = bindActionCreators(actions, this.props.dispatch);

        let taskId = parseInt(this.props.params.id);
        
        let task = this.props.tasks.filter(function(task) {
            return task.id === taskId;
        })[0];

        //if (this.state.hasOwnProperty('task') === false) {
        //    return <div>Loading...</div>;
        //}
    
        if (undefined === task) {
            return (
                <Error message="Task does not exist."/>
            )
        }

        return (
            <div>
                <TaskForm actions={boundActions} {...task}/>

                <p><strong>Created:</strong> {task.createdAt}</p>
                <p><strong>Updated:</strong> {task.updatedAt}</p>

                <Link to="/">Go back to list</Link>
            </div>
        );
    }
}
