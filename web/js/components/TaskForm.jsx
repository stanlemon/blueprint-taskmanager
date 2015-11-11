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
        this.setState({ [e.target.name]: e.target.value });
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props, nextProps)) {
            this.setState(nextProps);
        }
    }

    render() {
        return (
            <form className="well" onSubmit={this.handleSubmit.bind(this)}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input name="name" type="text" className="form-control" value={this.state.name} onChange={this.handleChange.bind(this)} />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea name="description" className="form-control" value={this.state.description} onChange={this.handleChange.bind(this)} />
                </div>
                <div className="form-group">
                    <button className="btn btn-primary col-sm-2">Save</button>
                </div>
                <div className="clearfix"></div>
            </form>
        );
    }
}
