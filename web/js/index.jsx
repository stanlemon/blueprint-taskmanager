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

import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import tasksApp from './reducers';

const store = compose(
  // Enables your middleware:
  //applyMiddleware(m1, m2, m3), // any Redux middleware, e.g. redux-thunk
  // Provides support for DevTools:
  devTools(),
  // Lets you write ?debug_session=<name> in address bar to persist debug sessions
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore)(tasksApp);

ReactDOM.render(
    <div>
        <Provider store={store}>
            <Router>
                <Route component={App}>
                    <Route name="taskListView" component={TaskListView} path="/"/>
                    <Route name="taskView" component={TaskView} path="/view/:id"/>
                </Route>
            </Router>
        </Provider>
        <DebugPanel top right bottom>
            <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
    </div>
, document.getElementById('app'))
