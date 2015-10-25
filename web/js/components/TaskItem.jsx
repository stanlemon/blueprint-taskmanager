import React from 'react';
import Router from 'react-router';
import { Link } from 'react-router';

export default class TaskItem extends React.Component {

	deleteTask() {
		this.props.click();
		//this.props.actions.deleteTask(this.props.task.id);
	}

	viewTask() {
		this.props.history.pushState(null, '/view/' + this.props.task.id);
	}

    render() {
		let task = this.props.task;

        return (
			<tr>
				<td onClick={this.viewTask.bind(this)}>
					{task.name}
				</td>
				<td>
					<button type="button" className="btn btn-xs btn-danger" onClick={this.deleteTask.bind(this)}>Delete</button>
				</td>
			</tr>
		)
	}
}
