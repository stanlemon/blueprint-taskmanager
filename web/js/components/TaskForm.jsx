/* @flow weak */
import { isEqual, find } from 'lodash';
import classNames from 'classnames';
import React from 'react';
import Form from './Form';
import FieldError from './FieldError';

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

    // This is an abstract method that should be overriden
    handleSubmit(state) {}

    render() {
        const { errors } = this.props;

        return (
            <Form className="well" fields={this.props.task} errors={errors} handler={this.handleSubmit.bind(this)}>
                <div className={classNames('form-group', { 'has-error': find(errors, (e) => e.field === 'name') })}>
                    <label htmlFor="name" className="control-label">Name</label>
                    <input name="name" type="text" className="form-control" validate={{ notEmpty: true, length: [4, 1000] }} />
                    <FieldError field="name" errors={errors}>
                        <span className="help-block">An error has ocurred</span>
                    </FieldError>
                </div>
                <div className={classNames('form-group', { 'has-error': find(errors, (e) => e.field === 'description') })}>
                    <label htmlFor="description" className="control-label">Description</label>
                    <textarea name="description" className="form-control" />
                    <FieldError field="description" errors={errors}>
                        <span className="help-block">An error has ocurred</span>
                    </FieldError>
                </div>
                <div className="form-group">
                    <button className="btn btn-primary col-sm-2">Save</button>
                </div>
                <div className="clearfix"></div>
            </Form>
        );
    }
}
