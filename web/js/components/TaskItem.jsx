/* @flow weak */
import { isEqual } from 'lodash';
import React from 'react';
import Router from 'react-router';
import { Link } from 'react-router';

export default class TaskItem extends React.Component {

    static defaultProps = {
        completed: null
    };

    static propTypes = {
        completed: React.PropTypes.string
    };

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
        if (!isEqual(this.props, nextProps)) {
            this.setState({
                completed: nextProps.task.completed
            });
        }
    }

    render() {
        let task = this.props.task;
        let taskName = task.completed === null ? <span>{task.name}</span> : <s>{task.name}</s>;

        return (
            <div style={{ border: '1px solid #e3e3e3', borderRadius: '4px', marginBottom: '8px' }}>
                <div className="row" style={{ margin: '10px' }}>
                    <div className="col-xs-7 col-sm-9 col-md-10" onClick={this.viewTask.bind(this)}>
                        {taskName}
                    </div>
                    <div className="col-xs-5 col-sm-3 col-md-2">
                        <div className="row">
                            <div className="col-xs-5 col-sm-7 text-right">
                                <input type="checkbox" checkedLink={this.completeTask(task)} />
                            </div>
                            <div className="col-xs-7 col-sm-3 text-right">
                                <button type="button" className="btn btn-xs btn-danger" onClick={this.deleteTask.bind(this)}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
