/* @flow weak */
import { isEqual, find } from 'lodash';
import classNames from 'classnames';
import React from 'react';
import Form from './Form';
import FieldError from './FieldError';
import { Link } from 'react-router';
import UserService from '../lib/UserService';

export default class RegisterView extends React.Component {

    userService = new UserService();

    handleSubmit(errors, data) {
        if (isEqual({}, errors) === false) {
            this.props.actions.addErrors(Object.keys(errors).map((field) => {
                return { field, message: errors[field].slice(0,1)[0] };
            }));
        } else {
            this.userService.register(data, (errors, user) => {
                if (errors) {
                    this.props.actions.addErrors(errors);
                } else {
                    this.props.history.pushState(null, '/');
                }
            });
        }
    }

    componentWillUnmount() {
        this.props.actions.addErrors([]);
    }

    render() {
        const { errors } = this.props;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-10 col-sm-8 col-xs-offset-1 col-sm-offset-2">
                        <h2>Register an Account</h2>
                        <div className="panel panel-info">
                            <div className="panel-body">
                                <Form className="form-horizontal" handler={this.handleSubmit.bind(this)}>
                                    <div className={classNames('form-group', { 'has-error': find(errors, (e) => e.field === 'name') })}>
                                        <label htmlFor="name" className="col-sm-2 control-label">Name</label>
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control" id="name" name="name" />
                                            <FieldError field="name" errors={errors}>
                                                <span className="help-block">An error has ocurred</span>
                                            </FieldError>
                                        </div>
                                    </div>
                                    <div className={classNames('form-group', { 'has-error': find(errors, (e) => e.field === 'email') })}>
                                        <label htmlFor="email" className="col-sm-2 control-label">Email</label>
                                        <div className="col-sm-10">
                                            <input type="email" className="form-control" id="email" name="email" />
                                            <FieldError field="email" errors={errors}>
                                                <span className="help-block">An error has ocurred</span>
                                            </FieldError>
                                        </div>
                                    </div>
                                    <div className={classNames('form-group', { 'has-error': find(errors, (e) => e.field === 'password') })}>
                                        <label htmlFor="password" className="col-sm-2 control-label">Password</label>
                                        <div className="col-sm-10">
                                            <input type="password" className="form-control" id="password" name="password" />
                                            <FieldError field="password" errors={errors}>
                                                <span className="help-block">An error has ocurred</span>
                                            </FieldError>
                                        </div>
                                    </div>

                                    <br />
                                    <div className="col-sm-6 col-sm-offset-3">
                                        <button type="submit" className="btn btn-primary btn-block">Register</button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                        <div style={{ minHeight: '2em' }} />
                        <div className="text-center">
                            <Link to="/login">Return to Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
