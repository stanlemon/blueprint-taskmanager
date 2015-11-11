import React from 'react';

export default class RegisterView extends React.Component {

    handleSubmit(e) {
        e.preventDefault();

        let { actions, history } = this.props;

        let data = {
            name: this.refs.name.value,
            email: this.refs.email.value,
            username: this.refs.username.value,
            password: this.refs.password.value
        }

        return fetch('/register', {
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
                      actions.error(message);
                  }
              } else {
                  actions.loadUser(data);

                  history.pushState(null, '/');
              }
          });
    }

    componentWillUnmount() {
        this.props.actions.clearErrors();
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-10 col-sm-8 col-xs-offset-1 col-sm-offset-2">
                        <h2>Register an Account</h2>
                        <div className="panel panel-info">
                            <div className="panel-body">

                                <form className="form-horizontal" method="post" role="form" onSubmit={this.handleSubmit.bind(this)}>
                                    <div className="form-group">
                                        <label htmlFor="name" className="col-sm-2 control-label">Name</label>
                                        <div className="col-sm-10">
                                            <input ref="name" type="text" className="form-control" id="name" name="name" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email" className="col-sm-2 control-label">Email</label>
                                        <div className="col-sm-10">
                                            <input ref="email" type="email" className="form-control" id="email" name="email" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="username" className="col-sm-2 control-label">Username</label>
                                        <div className="col-sm-10">
                                            <input ref="username" type="text" className="form-control" id="username" name="username" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password" className="col-sm-2 control-label">Password</label>
                                        <div className="col-sm-10">
                                            <input ref="password" type="password" className="form-control" id="password" name="password" />
                                        </div>
                                    </div>

                                    <br />
                                    <div className="col-sm-6 col-sm-offset-3">
                                        <button type="submit" className="btn btn-primary btn-block">Register</button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
