import React, { Component } from 'react';
import HelloWorld from './HelloWorld';
import TaskList from './TaskList';

export default class App extends Component {
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
                        <HelloWorld message="Hello World from your test Bootstrap application!"/>
                                <TaskList url="/api/tasks" pollInterval={2000}/>
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
