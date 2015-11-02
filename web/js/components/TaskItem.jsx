import React from 'react';
import Router from 'react-router';
import { Link } from 'react-router';

export default class TaskItem extends React.Component {

    static defaultProps = {
        completed: null
    }

    static propTypes = {
        completed: React.PropTypes.string
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            completed: this.props.task.completed,
        };
    }

    makeDateTime(d = new Date()) {
        return d.toISOString().replace('T', ' ').replace('Z', '') + ' ' + d.toString().substr(-11, 6);
    }

    deleteTask() {
        this.props.actions.deleteTask(this.props.task.id);
    }

    viewTask() {
        this.props.history.pushState(null, '/view/' + this.props.task.id);
    }

    completeTask(t) {
        return {
           value: t.completed !== null,
           requestChange: (checked) => {
               this.props.actions.updateTask({
                   ...this.props.task,
                   completed : checked ? this.makeDateTime() : null
               });
           }
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            completed: nextProps.task.completed
        });
    }

    render() {
        let task = this.props.task;

        return (
            <tr>
                <td onClick={this.viewTask.bind(this)}>
                    {task.name}
                </td>
                <td>
                    <input type="checkbox" checkedLink={this.completeTask(task)} />
                </td>
                <td>
                    <button type="button" className="btn btn-xs btn-danger" onClick={this.deleteTask.bind(this)}>Delete</button>
                </td>
            </tr>
        )
    }
}
