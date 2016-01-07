/* @flow weak */
import React from 'react';
import Error from './Error';

export default class LoginView extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    handleSubmit(e) {
        e.preventDefault();

        let { actions, history } = this.props;

        let data = {
            username: this.refs.username.value,
            password: this.refs.password.value
        }

        fetch('/login', {
            credentials: 'same-origin',
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
          .then(data => {
              if (data.error) {
                  for (let message of data.messages) {
                      actions.addError(message);
                  }
              } else {
                  actions.loadUser(data.user);

                  history.pushState(null, '/');
              }
          }).catch(function(error) {
              console.log('An error has occurred', error);
          });
    }

    componentWillUnmount() {
        this.props.actions.clearErrors();
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
                                <form className="form-horizontal" method="post" role="form" onSubmit={this.handleSubmit.bind(this)}>
                                  <div className="form-group">
                                    <label htmlFor="username" className="col-sm-3 control-label">Email</label>
                                    <div className="col-sm-9">
                                        <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-user"></i></span>
                                            <input ref="username" type="text" className="form-control" id="username" name="username" />
                                        </div>
                                    </div>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="password" className="col-sm-3 control-label">Password</label>
                                    <div className="col-sm-9">
                                        <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                                            <input ref="password" type="password" className="form-control" id="password" name="password" />
                                        </div>
                                    </div>
                                  </div>
                                  <br />
                                  <div className="col-sm-10 col-sm-offset-1">
                                    <button type="submit" className="btn btn-primary btn-block">Login</button>
                                  </div>
                                </form>
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
