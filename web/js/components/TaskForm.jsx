import isEqual from 'lodash/lang/isEqual';
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

        this.state = {
            id: props.id,
            name: props.name,
            description: props.description
        };
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

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props, nextProps)) {
            this.setState({
                id: nextProps.id,
                name: nextProps.name,
                description: nextProps.description
            });
        }
    }

    render() {
        return (
            <form className="well" onSubmit={this.handleSubmit.bind(this)}>
                <div className="form-group">
                    <label htmlFor="taskName">Name</label>
                    <input ref="taskName" type="text" className="form-control" id="taskName" value={this.state.name} onChange={this.handleChange.bind(this)} />
                </div>
                <div className="form-group">
                    <label htmlFor="taskDescription">Description</label>
                    <textarea ref="taskDescription" className="form-control" id="taskDescription" value={this.state.description} onChange={this.handleChange.bind(this)} />
                </div>
                <div className="form-group">
                    <button className="btn btn-primary col-sm-2">Save</button>
                </div>
                <div className="clearfix"></div>
            </form>
        );
    }
}
