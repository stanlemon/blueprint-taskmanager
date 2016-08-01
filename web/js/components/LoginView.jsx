import { isEqual, values } from 'lodash';
import React from 'react';
import Error from './Error';
import Form from './Form';

export default class LoginView extends React.Component {

    static propTypes = {
        router: React.PropTypes.object,
        children: React.PropTypes.node,
        actions: React.PropTypes.object,
        errors: React.PropTypes.object,
    };

    handleClickRegister(e) {
        e.preventDefault();
        this.props.router.push('/register');
    }

    handleSubmit(errors, data) {
        if (isEqual({}, errors) === false) {
            this.props.actions.addErrors(errors);
        } else {
            this.props.actions.login(data);
        }
    }

    componentWillUnmount() {
        this.props.actions.addErrors({});
    }

    render() {
        const { errors } = this.props;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-10 col-sm-8 col-md-6 col-xs-offset-1 col-sm-offset-2 col-md-offset-3">
                        {values(errors).map((error, i) => <Error key={i} message={error} />)}
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-10 col-sm-8 col-md-6 col-xs-offset-1 col-sm-offset-2 col-md-offset-3">
                        <div className="panel panel-info">
                            <div className="panel-heading">
                                <h3 className="panel-title"><strong>Login</strong></h3>
                            </div>
                            <div className="panel-body">
                                <div className="form-horizontal">
                                    <Form handler={this.handleSubmit.bind(this)}>
                                        <div className="form-group">
                                            <label htmlFor="username" className="col-sm-3 control-label">Email</label>
                                            <div className="col-sm-9">
                                                <div className="input-group">
                                                    <span className="input-group-addon"><i className="fa fa-user"></i></span>
                                                    <input type="email" className="form-control" id="username" name="username" />
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
                </div>
                <div style={{ minHeight: '15px' }} />
                <div className="row">
                    <div className="text-center col-xs-10 col-sm-8 col-md-6 col-xs-offset-1 col-sm-offset-2 col-md-offset-3">
                        <p>
                            Don't have an account? <a onClick={this.handleClickRegister.bind(this)} href="#">Create one now.</a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
