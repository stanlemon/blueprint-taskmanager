import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/';

@connect( state => state , dispatch => {
  return { actions: bindActionCreators(actions, dispatch) };
})
export default class App extends React.Component {

    componentWillMount() {
        this.props.actions.loadTasks();
    }

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
                                Task Manager
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
                        <h1>Task Manager</h1>
                        {React.cloneElement(this.props.children, this.props)}
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
