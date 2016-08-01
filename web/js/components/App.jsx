import React from 'react';

export default class App extends React.Component {

    static propTypes = {
        router: React.PropTypes.object,
        children: React.PropTypes.node,
        pollInterval: React.PropTypes.number,
        actions: React.PropTypes.object,
        loaded: React.PropTypes.array,
    };

    static defaultProps = {
        pollInterval: 3000,
    };

    componentWillMount() {
        this.props.actions.loadTasks();
    }

    home() {
        this.props.router.push('/');
    }

    logout(e) {
        e.preventDefault();
        this.props.actions.logout();
        this.props.actions.addErrors({});
        this.props.router.push('/login');
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-inverse navbar-fixed-top custom-navbar">
                    <div className="container">
                        <div className="navbar-header">
                            <a
                              style={{ cursor: 'pointer' }}
                              className="navbar-brand"
                              onTouchTap={this.home.bind(this)}
                            >
                                <i className="fa fa-cloud" />&nbsp;
                                Blueprint
                            </a>
                        </div>
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <a href="#" className="fa fa-sign-out" onTouchTap={this.logout.bind(this)} />
                            </li>
                        </ul>
                    </div>
                </nav>
                <div className="container">
                    {React.cloneElement(this.props.children, this.props)}
                </div>
            </div>
        );
    }
}
