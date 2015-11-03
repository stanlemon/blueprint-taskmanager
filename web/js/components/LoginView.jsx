import React from 'react';

export default class LoginView extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    handleSubmit(e) {
        e.preventDefault();

        let { actions } = this.props;

        let data = {
            username: this.refs.username.value,
            password: this.refs.password.value
        }

        return fetch('/login', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
          .then(data => {
              actions.loadUser(data.user);
          });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-10 col-sm-8 col-md-6 col-xs-offset-1 col-sm-offset-2 col-md-offset-3">
                        <div className="panel panel-info">
                            <div className="panel-heading">
                                <h3 className="panel-title"><strong>Login</strong></h3>
                            </div>
                            <div className="panel-body">
                                <form className="form-horizontal" method="post" role="form" onSubmit={this.handleSubmit.bind(this)}>
                                  <div className="form-group">
                                    <label htmlFor="inputEmail3" className="col-sm-3 control-label">Username</label>
                                    <div className="col-sm-9">
                                        <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-user"></i></span>
                                            <input ref="username" type="text" className="form-control" id="username" name="_username" />
                                        </div>
                                    </div>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="inputPassword3" className="col-sm-3 control-label">Password</label>
                                    <div className="col-sm-9">
                                        <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                                            <input ref="password" type="password" className="form-control" id="password" name="_password" />
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
            </div>
        );
    }
}
