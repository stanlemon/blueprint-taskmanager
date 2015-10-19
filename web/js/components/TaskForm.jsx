import React from 'react';
import * as taskAction from '../actions/';

export default class TaskForm extends React.Component {

    static defaultProps = {
        id: null,
        name: '',
        description: ''
    }

    static propTypes = {
        id: React.PropTypes.number,
        name: React.PropTypes.string,
        description: React.PropTypes.string
    }

    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            name: props.name,
            description: props.description
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    handleChange(e) {
        this.setState({
            id: this.state.id,
            name: this.refs.taskName.getDOMNode().value,
            description: this.refs.taskDescription.getDOMNode().value
        });
    }

    render() {
        return (
            <form className="well" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                <div className="form-group">
                    <label htmlFor="taskName">Name</label>
                    <input ref="taskName" type="text" className="form-control" id="taskName" defaultValue={this.state.name} />
                </div>
                <div className="form-group">
                    <label htmlFor="taskDescription">Description</label>
                    <textarea ref="taskDescription" className="form-control" id="taskDescription" defaultValue={this.state.description} />
                </div>
                <button className="btn btn-primary">Save</button>
            </form>
        );
    }
}
