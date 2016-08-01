import { isEqual } from 'lodash';
import classNames from 'classnames';
import React from 'react';
import Form from './Form';
import { Link } from 'react-router';
import UserService from '../lib/UserService';
import { mapErrors } from '../lib/Utils';

export default class RegisterView extends React.Component {

    static propTypes = {
        router: React.PropTypes.object,
        children: React.PropTypes.node,
        actions: React.PropTypes.object,
        errors: React.PropTypes.object,
    };

    userService = new UserService();

    handleSubmit(errors, data) {
        if (isEqual({}, errors) === false) {
            this.props.actions.addErrors(errors);
        } else {
            this.userService.register(data, (errs) => {
                if (errs) {
                    this.props.actions.addErrors(mapErrors(errs));
                } else {
                    this.props.router.push('/');
                }
            });
        }
    }

    componentWillUnmount() {
        this.props.actions.addErrors({});
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
                    msg: 'Your password must be between 8 and 64 characters long',
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
                                    <Form validate={validate} handler={this.handleSubmit.bind(this)}>
                                        <div className={classNames('form-group', { 'has-error': errors.name })}>
                                            <label htmlFor="name" className="col-sm-2 control-label">Name</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="name" name="name" />
                                                {errors.name && (<span className="help-block">{errors.name.slice(-1)}</span>)}
                                            </div>
                                        </div>
                                        <div className={classNames('form-group', { 'has-error': errors.email })}>
                                            <label htmlFor="email" className="col-sm-2 control-label">Email</label>
                                            <div className="col-sm-10">
                                                <input type="email" className="form-control" id="email" name="email" />
                                                {errors.email && (<span className="help-block">{errors.email.slice(-1)}</span>)}
                                            </div>
                                        </div>
                                        <div className={classNames('form-group', { 'has-error': errors.password })}>
                                            <label htmlFor="password" className="col-sm-2 control-label">Password</label>
                                            <div className="col-sm-10">
                                                <input type="password" className="form-control" id="password" name="password" />
                                                {errors.password && (<span className="help-block">{errors.password.slice(-1)}</span>)}
                                            </div>
                                        </div>

                                        <br />
                                        <div className="col-sm-6 col-sm-offset-3">
                                            <button type="submit" className="btn btn-primary btn-block">Register</button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                        <div style={{ minHeight: '2em' }} />
                        <div className="text-center">
                            <Link to="/login">Return to Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
