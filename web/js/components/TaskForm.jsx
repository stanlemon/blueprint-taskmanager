import React from 'react';

export default class TaskForm extends React.Component {

    static defaultProps = {
        id: null,
        name: '',
        description: ''
    }

    static propTypes = {
        id: React.PropTypes.number,
        name: React.PropTypes.string,
        description: React.PropTypes.string,
        actions: React.PropTypes.object
    }

    constructor(props, context) {
        super(props, context);
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    handleChange(e) {
        this.setState({
            id: this.props.id,
            name: this.refs.taskName.value,
            description: this.refs.taskDescription.value
        });
    }

    render() {
        return (
            <form className="well" onSubmit={this.handleSubmit.bind(this)}>
                <div className="form-group">
                    <label htmlFor="taskName">Name</label>
                    <input ref="taskName" type="text" className="form-control" id="taskName" defaultValue={this.props.name} onChange={this.handleChange.bind(this)} />
                </div>
                <div className="form-group">
                    <label htmlFor="taskDescription">Description</label>
                    <textarea ref="taskDescription" className="form-control" id="taskDescription" defaultValue={this.props.description} onChange={this.handleChange.bind(this)} />
                </div>
                <button className="btn btn-primary">Save</button>
            </form>
        );
    }
}
