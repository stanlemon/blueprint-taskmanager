/* @flow weak */
import React from 'react';
import LoginView from './LoginView';
import { contains } from 'lodash';

export default class App extends React.Component {

    logout(e) {
        e.preventDefault();
        this.props.actions.logout();
    }

    render() {
        if (!contains(this.props.loaded, 'user')) {
            return <div/>
        }

        if (this.props.user === false) {
            return <LoginView {...this.props}/>
        }

        let year = (new Date()).getFullYear();

        return (
            <div>
                <nav className="navbar navbar-inverse navbar-fixed-top custom-navbar">
                    <div className="container">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">
                                <i className="fa fa-cloud"/>&nbsp;
                                Blueprint
                            </a>
                        </div>
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <a href="#" className="fa fa-sign-out" onClick={this.logout.bind(this)}/>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div className="container">
                    <div>
                        {React.cloneElement(this.props.children, this.props)}
                    </div>
                    <div className="clearfix"></div>

                    <hr />
                    <footer>
                        <p>&copy; {year} Copyright</p>
                    </footer>
                </div>
            </div>
        );
    }
}
