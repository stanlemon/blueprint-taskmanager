/* @flow weak */
import { isEqual, isBoolean, isDate } from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import React from 'react';
import Form from './Form';
import { makeDateTime } from '../lib/Utils';
import { DateTimePicker } from 'react-widgets';

export default class TaskForm extends React.Component {

    handleSave() {}

    handleSubmit(errors, data) {
        if (isEqual({}, errors) === false) {
            this.props.actions.addErrors(errors);
            return null;
        } else {
            data.due = this.state.due;

            this.setState({ due: null });

            if (!isDate(data.completed)) {
                data.completed = (data.completed === true) ? makeDateTime() : null;
            }

            return this.handleSave(data);
        }
    }

    componentWillMount() {
        const due = this.props.task && this.props.task.due ? this.props.task.due : null;
        this.setState({
            due
        });
    }


    componentWillUnmount() {
        this.props.actions.addErrors({});
    }

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
                <div>
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
                    <div className={classNames('form-group', { 'has-error': errors.due })}>
                        <label htmlFor="due" className="control-label">Due</label>
                        <DateTimePicker value={this.state.due} onChange={(due) => this.setState({ due })}/>
                        {errors.due && (<span className="help-block">{errors.due}</span>)}
                    </div>
                    {task && task.id && (
                        <div className="checkbox">
                            <label htmlFor="completed" className="control-label">
                                <input name="completed" type="checkbox" />
                                Completed
                                {task.completed && !isBoolean(task.completed) && (
                                    <em> on {moment(task.completed).format('MMMM Do YYYY, h:mm:ssa')}</em>
                                )}
                            </label>
                        </div>
                    )}
                    <div className="form-group">
                        <button className="btn btn-primary col-sm-2">Save</button>
                    </div>
                    <div className="clearfix"></div>
                    </div>
            </Form>
        );
    }
}

TaskForm.propTypes = {
    children: React.PropTypes.node,
    actions: React.PropTypes.object,
    task: React.PropTypes.object,
    errors: React.PropTypes.object,
};
