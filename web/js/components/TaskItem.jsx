import React from 'react';
import { Link } from 'react-router';

export default React.createClass({

	deleteTask() {
		this.props.actions.deleteTask(this.props.task.id);
	},

    render() {
		let task = this.props.task;

        return (
			<tr>
				<td>
					<Link to={`/view/${task.id}`}>{task.name}</Link>
				</td>
				<td className="text-center">
					<button type="button" className="btn btn-xs btn-danger" onClick={this.deleteTask}>Delete</button>
				</td>
			</tr>
		)
	}
});
