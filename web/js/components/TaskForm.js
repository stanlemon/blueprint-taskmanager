import { isEqual, isBoolean } from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';
import Form from './Form';
import { makeDateTime } from '../lib/Utils';

export default class TaskForm extends React.Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        task: PropTypes.object,
        errors: PropTypes.object,
    };

    static defaultProps = {
        task: {},
        errors: {},
    };

    state = {
        due: null,
    };

    handleSave() {}

    handleSubmit(errors, data) {
        if (isEqual({}, errors) === false) {
            this.props.actions.addErrors(errors);
            return null;
        }

        const result = this.handleSave(
            Object.assign({}, data, {
                due: this.state.due,
                completed: data.completed === true ? makeDateTime() : null,
            })
        );

        this.setState({ due: null });

        return result;
    }

    componentWillMount() {
        const due =
            this.props.task && this.props.task.due ? this.props.task.due : null;
        this.setState({ due });
    }

    componentWillUnmount() {
        this.props.actions.clearErrors();
    }

    render() {
        const { task, errors } = this.props;

        const validate = {
            name: {
                notEmpty: {
                    msg: 'You must enter a name for this task.',
                },
            },
        };

        return (
            <div className="well">
                <Form
                    validate={validate}
                    fields={task}
                    errors={errors}
                    handler={this.handleSubmit.bind(this)}
                >
                    <div>
                        <div
                            className={classNames('form-group', {
                                'has-error': errors.name,
                            })}
                        >
                            <label htmlFor="name" className="control-label">
                                Name
                                <input
                                    name="name"
                                    type="text"
                                    className="form-control"
                                />
                                {errors.name &&
                                    <span className="help-block">
                                        {errors.name}
                                    </span>}
                            </label>
                        </div>
                        <div
                            className={classNames('form-group', {
                                'has-error': errors.description,
                            })}
                        >
                            <label
                                htmlFor="description"
                                className="control-label"
                            >
                                Description
                                <textarea
                                    name="description"
                                    className="form-control"
                                />
                                {errors.description &&
                                    <span className="help-block">
                                        {errors.description}
                                    </span>}
                            </label>
                        </div>
                        <div
                            className={classNames('form-group', {
                                'has-error': errors.due,
                            })}
                        >
                            <label htmlFor="due" className="control-label">
                                Due
                                <Datetime
                                    value={this.state.due}
                                    onChange={due => this.setState({ due })}
                                />
                                {errors.due &&
                                    <span className="help-block">
                                        {errors.due}
                                    </span>}
                            </label>
                        </div>
                        {task &&
                            task.id &&
                            <div className="checkbox">
                                <label
                                    htmlFor="completed"
                                    className="control-label"
                                >
                                    <input name="completed" type="checkbox" />
                                    Completed
                                    {task.completed &&
                                        !isBoolean(task.completed) &&
                                        <em>
                                            {' '}on{' '}
                                            {moment(task.completed).format(
                                                'MMMM Do YYYY, h:mm:ssa'
                                            )}
                                        </em>}
                                </label>
                            </div>}
                        <div className="form-group">
                            <button className="btn btn-primary col-sm-2">
                                Save
                            </button>
                        </div>
                        <div className="clearfix" />
                    </div>
                </Form>
            </div>
        );
    }
}
