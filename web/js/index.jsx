import React from 'react';
import Router, { DefaultRoute, Route } from 'react-router';
import Bootstrap from 'bootstrap/less/bootstrap.less';
import FontAwesome from 'font-awesome/less/font-awesome.less';
import 'whatwg-fetch';
import Css from '../css/main.less';
import App from './components/App';
import TaskListView from './components/TaskListView';
import TaskView from './components/TaskView';

let routes = (
    <Route handler={App}>
        <Route name="taskListView" handler={TaskListView} path="/"/>
        <Route name="taskView" handler={TaskView} path="/view/:id"/>
    </Route>
);

Router.run(routes, Router.HashLocation, (Root) => {
    React.render(<Root/>, document.body);
});
