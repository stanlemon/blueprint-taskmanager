/* @flow weak */
import { isEqual, omit } from 'lodash';
import classNames from 'classnames';
import React from 'react';
import Form from './Form';

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
        description: '',
        actions: {},
        errors: []
    };

    static propTypes = {
        id: React.PropTypes.number,
        name: React.PropTypes.string,
        description: React.PropTypes.string,
        actions: React.PropTypes.object,
        errors: React.PropTypes.array
    };

    handleSubmit(state) {
        console.log(state);
    }

    render() {
        const nameClasses = classNames('form-group', { 'has-error': hasError('name', this.props.errors) });
        const task = omit(this.props, ['actions', 'errors']);

        return (
            <Form className="well" fields={task} errors={this.props.errors} handler={this.handleSubmit.bind(this)}>
                <div className={nameClasses}>
                    <label htmlFor="name" className="control-label">Name</label>
                    <input name="name" type="text" className="form-control" />
                    {hasError('name', this.props.errors) && <span className="help-block">An error has ocurred</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="description" className="control-label">Description</label>
                    <textarea name="description" className="form-control" />
                    {hasError('description', this.props.errors) && <span className="help-block">An error has ocurred</span>}
                </div>
                <div className="form-group">
                    <button className="btn btn-primary col-sm-2">Save</button>
                </div>
                <div className="clearfix"></div>
            </Form>
        );
    }
}
