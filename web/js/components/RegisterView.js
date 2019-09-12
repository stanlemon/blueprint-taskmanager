import isEmpty from 'lodash/isEmpty';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registerUser } from '../actions/';

export class RegisterView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {
                name: '',
                email: '',
                password: '',
            },
        };
    }

    handleClickToLogin = () => {
        this.props.navigateTo('/login');
    };

    handleSubmit = e => {
        e.preventDefault();

        const errors = {};

        if (isEmpty(this.state.data) || isEmpty(this.state.data.name)) {
            errors['name'] = 'You must enter your name.';
        }

        if (isEmpty(this.state.data) || isEmpty(this.state.data.email)) {
            errors['email'] = 'You must enter your email.';
        }

        if (
            !isEmpty(this.state.data.email) &&
            !isEmail(this.state.data.email)
        ) {
            errors['email'] = 'You must enter a valid email address.';
        }

        if (isEmpty(this.state.data) || isEmpty(this.state.data.password)) {
            errors['password'] = 'You must enter your password.';
        }

        if (
            !isEmpty(this.state.data.password) &&
            !isLength(this.state.data.password, { min: 8, max: 64 })
        ) {
            errors['password'] =
                'Your password must be between 8 and 64 characters in length.';
        }

        // If there are any errors, bail
        if (Object.keys(errors).length > 0) {
            this.setState(state => {
                return { ...state, ...{ errors } };
            });
            return;
        }

        // Clear out our errors
        this.setState(state => {
            return { ...state, errors: {} };
        });

        this.props.registerUser(this.state.data);
    };

    setValue = e => {
        const key = e.target.name;
        const value = e.target.value;

        this.setState(state => {
            return {
                ...state,
                ...{
                    data: {
                        ...state.data,
                        ...{ [key]: value },
                    },
                },
            };
        });
    };

    render() {
        const errors = { ...this.props.errors, ...this.state.errors };

        // TODO: Add double entry of password
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-10 col-sm-8 col-xs-offset-1 col-sm-offset-2">
                        <h2>Register an Account</h2>
                        <div className="panel panel-info">
                            <div className="panel-body">
                                <div className="form-horizontal">
                                    <form
                                        className="register-form"
                                        onSubmit={this.handleSubmit}
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
                                                        value={
                                                            this.state.data.name
                                                        }
                                                        onChange={this.setValue}
                                                    />
                                                    {errors.name && (
                                                        <span className="help-block">
                                                            {errors.name}
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
                                                        value={
                                                            this.state.data
                                                                .email
                                                        }
                                                        onChange={this.setValue}
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
                                                        value={
                                                            this.state.data
                                                                .password
                                                        }
                                                        onChange={this.setValue}
                                                    />
                                                    {errors.password && (
                                                        <span className="help-block">
                                                            {errors.password}
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
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div style={{ minHeight: '2em' }} />
                        <div className="text-center">
                            <button
                                className="btn btn-link"
                                onClick={this.handleClickToLogin}
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

RegisterView.propTypes = {
    navigateTo: PropTypes.func.isRequired,
    registerUser: PropTypes.func.isRequired,
    errors: PropTypes.object,
};

export default connect(
    state => ({ errors: state.errors }),
    { registerUser }
)(RegisterView);
