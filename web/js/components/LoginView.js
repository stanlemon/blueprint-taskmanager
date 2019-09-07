import isEmpty from 'lodash/isEmpty';
import React from 'react';
import PropTypes from 'prop-types';
import Error from './Error';

export default class LoginView extends React.Component {
    static propTypes = {
        navigateTo: PropTypes.func.isRequired,
        actions: PropTypes.object.isRequired,
        errors: PropTypes.shape({
            main: PropTypes.arrayOf(PropTypes.string),
        }),
    };

    static defaultProps = {
        actions: {},
    };

    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            data: {
                username: '',
                password: '',
            },
        };
    }

    handleClickToRegister = () => {
        this.props.navigateTo('/register');
    };

    handleSubmit = e => {
        e.preventDefault();

        const errors = {};

        if (isEmpty(this.state.data) || isEmpty(this.state.data.username)) {
            errors['username'] = 'You must enter your username.';
        }

        if (isEmpty(this.state.data) || isEmpty(this.state.data.password)) {
            errors['password'] = 'You must enter your password.';
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

        this.props.actions.login(this.state.data);
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
        const errors = {
            // These errors came from the component's validation that occurred on a submit
            ...this.state.errors,
            // Errors are a map keyed to an array here, but we only want the first message off of the main key
            ...(isEmpty(this.props.errors)
                ? {}
                : { main: this.props.errors.main[0] }),
        };

        const { username, password } = this.state.data;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-10 col-sm-8 col-md-6 col-xs-offset-1 col-sm-offset-2 col-md-offset-3">
                        {Object.entries(errors).map(([key, value]) => (
                            <Error key={key} message={value} />
                        ))}
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-10 col-sm-8 col-md-6 col-xs-offset-1 col-sm-offset-2 col-md-offset-3">
                        <div className="panel panel-info">
                            <div className="panel-heading">
                                <h3 className="panel-title">
                                    <strong>Login</strong>
                                </h3>
                            </div>
                            <div className="panel-body">
                                <div className="form-horizontal">
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="username">
                                                <div className="col-sm-3 control-label">
                                                    Email
                                                </div>
                                                <div className="col-sm-9">
                                                    <div className="input-group">
                                                        <span className="input-group-addon">
                                                            <i className="fa fa-user" />
                                                        </span>
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            id="username"
                                                            name="username"
                                                            value={username}
                                                            onChange={
                                                                this.setValue
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">
                                                <div className="col-sm-3 control-label">
                                                    Password
                                                </div>
                                                <div className="col-sm-9">
                                                    <div className="input-group">
                                                        <span className="input-group-addon">
                                                            <i className="fa fa-lock" />
                                                        </span>
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            id="password"
                                                            name="password"
                                                            value={password}
                                                            onChange={
                                                                this.setValue
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                        <br />
                                        <div className="col-sm-10 col-sm-offset-1">
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-block"
                                            >
                                                Login
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ minHeight: '15px' }} />
                <div className="row">
                    <div className="text-center">
                        <p>
                            Don't have an account?
                            <button
                                type="button"
                                className="btn btn-link"
                                onClick={this.handleClickToRegister}
                            >
                                Create one now.
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
