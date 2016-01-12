/* @flow weak */
import { isEqual, find } from 'lodash';
import classNames from 'classnames';
import React from 'react';
import Form from './Form';

export default class TaskForm extends React.Component {

    // This is an abstract method that should be overriden
    handleSubmit(state) {}

    render() {
        const { task, errors } = this.props;

        const validate = {
            name: {
                notEmpty: {
                    msg: 'You must enter a name for this task.' 
                }
            }
        };

        return (
            <Form className="well" validate={validate} fields={task} errors={errors} handler={this.handleSubmit.bind(this)}>
                <div className={classNames('form-group', { 'has-error': errors.name })}>
                    <label htmlFor="name" className="control-label">Name</label>
                    <input name="name" type="text" className="form-control" />
                    {errors.name && (<span className="help-block">{errors.name}</span>)}
                </div>
                <div className={classNames('form-group', { 'has-error': errors.description })}>
                    <label htmlFor="description" className="control-label">Description</label>
                    <textarea name="description" className="form-control" />
                    {errors.description && (<span className="help-block">{errors.description}</span>)}
                </div>
                <div className="form-group">
                    <button className="btn btn-primary col-sm-2">Save</button>
                </div>
                <div className="clearfix"></div>
            </Form>
        );
    }
}
