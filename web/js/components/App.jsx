import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/';
import LoginForm from './LoginView';

@connect( state => state , dispatch => {
  return { actions: bindActionCreators(actions, dispatch) };
})
export default class App extends React.Component {

    static defaultProps = {
        pollInterval: 3000
    }

    static propTypes = {
        pollInterval: React.PropTypes.number,
    }

    componentWillMount() {
        this.props.actions.loadTasks();
        this.props.actions.loadUser();

        //setInterval(this.props.actions.loadUser, this.props.pollInterval);
    }

    logout(e) {
        console.log('logging out');
        console.log(this.props.actions);
        e.preventDefault();
        this.props.actions.logout();
    }

    render() {
        if (this.props.user === false) {
            return <LoginForm actions={this.props.actions}/>
        }

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
                                <li><a href="#" onClick={this.logout.bind(this)}>Logout</a></li>
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
