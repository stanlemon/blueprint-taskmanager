import isBoolean from 'lodash/isBoolean';
import classNames from 'classnames';
import format from 'date-fns/format';
import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import isEmpty from 'lodash/isEmpty';
import { DATE_FORMAT_LONG } from '../lib/Utils';

export default class TaskForm extends React.Component {
    static propTypes = {
        save: PropTypes.func.isRequired,
        task: PropTypes.object,
        errors: PropTypes.object,
    };

    static defaultProps = {
        // Define the full form here, otherwise you'll get an error about switching between controlled & uncontrolled components
        task: {
            name: '',
            description: '',
            completed: false,
            due: null,
        },
        errors: {},
    };

    constructor(props) {
        super(props);

        this.state = {
            data: this.props.task,
            errors: this.props.errors,
        };
    }

    handleSubmit = e => {
        e.preventDefault();

        const errors = {};

        if (isEmpty(this.state.data) || isEmpty(this.state.data.name)) {
            errors['name'] = 'You must enter a name for this task.';
        }

        // If there are any errors, bail
        if (Object.keys(errors).length > 0) {
            this.setState(state => {
                return { ...state, ...{ errors } };
            });
            return;
        }

        const result = this.props.save(this.state.data);

        // TODO: Should this check to see if anything was returned before resetting 'data'?
        this.setState({ errors: {}, data: result });
    };

    setDueDate = due => {
        this.setData('due', due);
    };

    setData = (key, value) => {
        this.setState(state => {
            return {
                ...state,
                ...{
                    data: { ...state.data, ...{ [key]: value } },
                },
            };
        });
    };

    setValue = e => {
        if (e.target.type && e.target.type === 'checkbox') {
            this.setData(e.target.name, e.target.checked);
        } else {
            this.setData(e.target.name, e.target.value);
        }
    };

    render() {
        const task = this.state.data;
        const errors = this.state.errors;

        return (
            <div className="well">
                <form onSubmit={this.handleSubmit}>
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
                                    onChange={this.setValue}
                                    value={task.name}
                                />
                                {errors.name && (
                                    <span className="help-block">
                                        {errors.name}
                                    </span>
                                )}
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
                                    onChange={this.setValue}
                                    value={task.description}
                                />
                                {errors.description && (
                                    <span className="help-block">
                                        {errors.description}
                                    </span>
                                )}
                            </label>
                        </div>
                        <div
                            className={classNames('form-group', {
                                'has-error': errors.due,
                            })}
                        >
                            <label htmlFor="due" className="control-label">
                                Due
                                <div>
                                    <DatePicker
                                        name="due"
                                        className="form-control"
                                        selected={task.due}
                                        onChange={this.setDueDate}
                                        showTimeSelect
                                        dateFormat="MM/dd/yyyy h:mma"
                                    />
                                </div>
                                {errors.due && (
                                    <span className="help-block">
                                        {errors.due}
                                    </span>
                                )}
                            </label>
                        </div>
                        {task && task.id && (
                            <div className="checkbox">
                                <label
                                    htmlFor="completed"
                                    className="control-label"
                                >
                                    <input
                                        name="completed"
                                        type="checkbox"
                                        checked={task.completed ? true : false}
                                        onChange={this.setValue}
                                    />
                                    Completed
                                    {task.completed &&
                                        !isBoolean(task.completed) && (
                                            <em>
                                                {' '}
                                                on{' '}
                                                {format(
                                                    task.completed,
                                                    DATE_FORMAT_LONG
                                                )}
                                            </em>
                                        )}
                                </label>
                            </div>
                        )}
                        <div className="form-group">
                            <button
                                name="saveTask"
                                className="btn btn-primary col-sm-2"
                            >
                                Save
                            </button>
                        </div>
                        <div className="clearfix" />
                    </div>
                </form>
            </div>
        );
    }
}
