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
        // This is an abstract method that should be overriden
    }

    render() {
        const nameClasses = classNames('form-group', { 'has-error': hasError('name', this.props.errors) });

        const validate = {
            description: {
                notEmpty: true, length: [2, 1000] 
            }
        };

        return (
            <Form validate={validate} className="well" fields={this.props.task} errors={this.props.errors} handler={this.handleSubmit.bind(this)}>
                <div className={classNames('form-group', { 'has-error': hasError('name', this.props.errors) })}>
                    <label htmlFor="name" className="control-label">Name</label>
                    <input name="name" type="text" className="form-control" validate={{ notEmpty: true, length: [4, 1000] }} />
                    {hasError('name', this.props.errors) && <span className="help-block">An error has ocurred</span>}
                </div>
                <div className={classNames('form-group', { 'has-error': hasError('description', this.props.errors) })}>
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
