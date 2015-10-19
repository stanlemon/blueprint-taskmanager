import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import Bootstrap from 'bootstrap/less/bootstrap.less';
import FontAwesome from 'font-awesome/less/font-awesome.less';
import 'whatwg-fetch';
import Css from '../css/main.less';
import App from './components/App';
import TaskListView from './components/TaskListView';
import TaskView from './components/TaskView';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import tasksApp from './reducers';

let store = createStore(tasksApp);

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Route component={App}>
                <Route name="taskListView" component={TaskListView} path="/"/>
                <Route name="taskView" component={TaskView} path="/view/:id"/>
            </Route>
        </Router>
    </Provider>
, document.getElementById('app'))
