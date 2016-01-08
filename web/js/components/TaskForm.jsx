/* @flow weak */
import { isEqual } from 'lodash';
import classNames from 'classnames';
import React from 'react';

function hasError(field, errors) {
    let ret = false;
    errors.forEach( (error, i) => {
        if (error.field === field) {
            ret = true;
        }
    });
    return ret;
}

export default class TaskForm extends React.Component {

    static defaultProps = {
        id: null,
        name: '',
        description: ''
    };

    static propTypes = {
        id: React.PropTypes.number,
        name: React.PropTypes.string,
        description: React.PropTypes.string,
        actions: React.PropTypes.object
    };

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
        // If the next properties are not equal and we don't have errors
        // If we have errors we don't want to lose our state
        if (!isEqual(this.props, nextProps) && nextProps.errors.length === 0) {
            this.setState(nextProps);
        }
    }

    render() {
        const nameClasses = classNames('form-group', { 'has-error': hasError('name', this.props.errors) });

        return (
            <form className="well" onSubmit={this.handleSubmit.bind(this)}>
                <div className={nameClasses}>
                    <label htmlFor="name" className="control-label">Name</label>
                    <input name="name" type="text" className="form-control" value={this.state.name} onChange={this.handleChange.bind(this)} />
                    {(hasError('name', this.props.errors) ? <span className="help-block">An error has ocurred</span> : false)}
                </div>
                <div className="form-group">
                    <label htmlFor="description" className="control-label">Description</label>
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
