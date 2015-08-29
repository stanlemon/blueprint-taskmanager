import React from 'react';
import Router, { DefaultRoute, Route } from 'react-router';
import App from './App';
import TaskList from './TaskList';
import TaskView from './TaskView';
import Bootstrap from 'bootstrap/less/bootstrap.less';
import FontAwesome from 'font-awesome/less/font-awesome.less';
import Css from '../css/main.less';
import 'whatwg-fetch';

let routes = (
    <Route handler={App}>
        <Route name="taskList" handler={TaskList} path="/"/>
        <Route name="taskView" handler={TaskView} path="/view/:id"/>
    </Route>
);

Router.run(routes, Router.HashLocation, (Root) => {
  React.render(<Root/>, document.body);
});
