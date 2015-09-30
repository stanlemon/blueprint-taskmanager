import React from 'react';
import Router, { RouteHandler } from 'react-router';

export default class App extends React.Component {

    render() {
        return (
            <div>
                <nav className="navbar navbar-inverse navbar-fixed-top">
                    <div className="container">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="#">
                                <i className="fa fa-cloud"/>&nbsp;
                                Foobar
                            </a>
                        </div>
                        <div id="navbar" className="collapse navbar-collapse">
                            <ul className="nav navbar-nav">
                                <li className="active"><a href="#">Home</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="container">
                    <div>
                        <h1>Foobar in Bootstrap</h1>
                        <RouteHandler/>
                    </div>
                    <hr />
                    <footer>
                        <p>&copy; {(new Date()).getFullYear()} Copyright</p>
                    </footer>
                </div>
            </div>
        );
    }
}
