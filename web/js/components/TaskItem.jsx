import React from 'react';
import Reflux from 'reflux';
import { Link } from 'react-router';
import TaskForm from './TaskForm';
import TaskStore from '../stores/TaskStore';
import TaskActions from '../actions/TaskActions';

export default React.createClass({

	deleteTask() {
		TaskActions.deleteTask(this.props.task.id);
	},

    render() {
		let task = this.props.task;

        return (
			<li key={task.id}>
				<p>
					<strong>
						<Link to="taskView" params={{id: task.id}}>{task.name}</Link>
					</strong>
					<button type="button" className="btn btn-xs btn-danger" onClick={this.deleteTask}>Delete</button>
				</p>
			</li>
		)
	}
});
