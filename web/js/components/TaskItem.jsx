import React from 'react';
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
			<tr>
				<td>
					<Link to="taskView" params={{id: task.id}}>{task.name}</Link>
				</td>
				<td className="text-center">
					<button type="button" className="btn btn-xs btn-danger" onClick={this.deleteTask}>Delete</button>
				</td>
			</tr>
		)
	}
});
