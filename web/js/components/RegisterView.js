import { isEqual } from 'lodash';
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Form from './Form';

export default class RegisterView extends React.Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        navigateTo: PropTypes.func.isRequired,
        errors: PropTypes.object,
    };

    static defaultProps = {
        actions: {},
        errors: {},
    };

    handleSubmit(errors, data) {
        if (isEqual({}, errors) === false) {
            this.props.actions.addErrors(errors);
        } else {
            this.props.actions.registerUser(data);
        }
    }

    componentWillUnmount() {
        this.props.actions.clearErrors();
    }

    render() {
        const { errors } = this.props;

        const validate = {
            name: {
                notEmpty: {
                    msg: 'You must enter a name.',
                },
            },
            email: {
                isEmail: {
                    msg: 'You must enter a valid email address.',
                },
                notEmpty: {
                    msg: 'You must enter a email address.',
                },
            },
            password: {
                length: {
                    args: [8, 64],
                    msg:
                        'Your password must be between 8 and 64 characters long',
                },
                notEmpty: {
                    msg: 'You must enter a password',
                },
            },
        };

        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-10 col-sm-8 col-xs-offset-1 col-sm-offset-2">
                        <h2>Register an Account</h2>
                        <div className="panel panel-info">
                            <div className="panel-body">
                                <div className="form-horizontal">
                                    <Form
                                        validate={validate}
                                        handler={this.handleSubmit.bind(this)}
                                    >
                                        <div
                                            className={classNames(
                                                'form-group',
                                                { 'has-error': errors.name }
                                            )}
                                        >
                                            <label htmlFor="name">
                                                <div className="col-sm-2 control-label">
                                                    Name
                                                </div>
                                                <div className="col-sm-10">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="name"
                                                        name="name"
                                                    />
                                                    {errors.name && (
                                                        <span className="help-block">
                                                            {errors.name.slice(
                                                                -1
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </label>
                                        </div>
                                        <div
                                            className={classNames(
                                                'form-group',
                                                { 'has-error': errors.email }
                                            )}
                                        >
                                            <label htmlFor="email">
                                                <div className="col-sm-2 control-label">
                                                    Email
                                                </div>
                                                <div className="col-sm-10">
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        id="email"
                                                        name="email"
                                                    />
                                                    {errors.email && (
                                                        <span className="help-block">
                                                            {errors.email}
                                                        </span>
                                                    )}
                                                </div>
                                            </label>
                                        </div>
                                        <div
                                            className={classNames(
                                                'form-group',
                                                {
                                                    'has-error':
                                                        errors.password,
                                                }
                                            )}
                                        >
                                            <label htmlFor="password">
                                                <div className="col-sm-2 control-label">
                                                    Password
                                                </div>
                                                <div className="col-sm-10">
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="password"
                                                        name="password"
                                                    />
                                                    {errors.password && (
                                                        <span className="help-block">
                                                            {errors.password.slice(
                                                                -1
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </label>
                                        </div>

                                        <br />
                                        <div className="col-sm-6 col-sm-offset-3">
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-block"
                                            >
                                                Register
                                            </button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                        <div style={{ minHeight: '2em' }} />
                        <div className="text-center">
                            <button
                                className="btn btn-link"
                                onClick={() => this.props.navigateTo('/login')}
                            >
                                Return to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
