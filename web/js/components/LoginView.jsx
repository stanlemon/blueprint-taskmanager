/* @flow weak */
import React from 'react';
import Error from './Error';
import Form from './Form';
import UserService from '../lib/UserService';

export default class LoginView extends React.Component {

    userService = new UserService();

    constructor(props, context) {
        super(props, context);
    }

    handleSubmit(errors, data) {
        let { actions, history } = this.props;

        this.userService.login(data, (errors, user) => {
            if (errors) {
                actions.addErrors(errors);
            } else {
                actions.loadUser(user);
                history.pushState(null, '/');
            }
        });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-10 col-sm-8 col-md-6 col-xs-offset-1 col-sm-offset-2 col-md-offset-3">
                        {this.props.errors.map((error, i) => {
                            return <Error key={i} message={error}/>
                        })}
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-10 col-sm-8 col-md-6 col-xs-offset-1 col-sm-offset-2 col-md-offset-3">
                        <div className="panel panel-info">
                            <div className="panel-heading">
                                <h3 className="panel-title"><strong>Login</strong></h3>
                            </div>
                            <div className="panel-body">
                                <Form className="form-horizontal" handler={this.handleSubmit.bind(this)}>
                                    <div className="form-group">
                                        <label htmlFor="username" className="col-sm-3 control-label">Email</label>
                                        <div className="col-sm-9">
                                                <div className="input-group">
                                                    <span className="input-group-addon"><i className="fa fa-user"></i></span>
                                                    <input type="text" className="form-control" id="username" name="username" />
                                                </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password" className="col-sm-3 control-label">Password</label>
                                        <div className="col-sm-9">
                                                <div className="input-group">
                                                    <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                                                    <input type="password" className="form-control" id="password" name="password" />
                                                </div>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="col-sm-10 col-sm-offset-1">
                                        <button type="submit" className="btn btn-primary btn-block">Login</button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ minHeight: '15px' }}/>
                <div className="row">
                    <div className="text-center col-xs-10 col-sm-8 col-md-6 col-xs-offset-1 col-sm-offset-2 col-md-offset-3">
                        <p>
                            Don't have an account?  <a href="/#/register">Create one now.</a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
