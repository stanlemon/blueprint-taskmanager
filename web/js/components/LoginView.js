import isEqual from 'lodash/isEqual';
import values from 'lodash/values';
import React from 'react';
import PropTypes from 'prop-types';
import Error from './Error';
import Form from './Form';

export default class LoginView extends React.Component {
    static propTypes = {
        navigateTo: PropTypes.func.isRequired,
        actions: PropTypes.object.isRequired,
        errors: PropTypes.object,
    };

    static defaultProps = {
        actions: {},
        errors: {},
    };

    handleClickToRegister = () => {
        this.props.navigateTo('/register');
    };

    handleSubmit = (errors, data) => {
        if (isEqual({}, errors) === false) {
            this.props.actions.addErrors(errors);
        } else {
            this.props.actions.login(data);
        }
    };

    componentWillUnmount() {
        this.props.actions.clearErrors();
    }

    render() {
        const { errors } = this.props;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-10 col-sm-8 col-md-6 col-xs-offset-1 col-sm-offset-2 col-md-offset-3">
                        {values(errors).map(error => (
                            <Error key={error} message={error} />
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
                                    <Form handler={this.handleSubmit}>
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
                                    </Form>
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
