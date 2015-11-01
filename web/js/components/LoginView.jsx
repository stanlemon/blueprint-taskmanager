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
              console.log(data);
              console.log(actions);
              actions.loadUser();
          });
    }

    render() {
        return (
            <div className="col-md-6 col-md-offset-3">
                <div className="panel panel-info">
                    <div className="panel-heading">
                        <h3 className="panel-title"><strong>Login</strong></h3>
                    </div>
                    <div className="panel-body">
                        <form className="form-horizontal" method="post" role="form" onSubmit={this.handleSubmit.bind(this)}>
                          <div className="form-group">
                            <label htmlFor="inputEmail3" className="col-sm-2 control-label">Username</label>
                            <div className="col-sm-10">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="glyphicon glyphicon-user"></i></span>
                                    <input ref="username" type="text" className="form-control" id="username" name="_username" />
                                </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="inputPassword3" className="col-sm-2 control-label">Password</label>
                            <div className="col-sm-10">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="glyphicon glyphicon-lock"></i></span>
                                    <input ref="password" type="password" className="form-control" id="password" name="_password" />
                                </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                              <button type="submit" className="btn btn-primary btn-block">Login</button>
                            </div>
                          </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
