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
import thunk from 'redux-thunk';
import reducer from './reducers';

const store = compose(
    applyMiddleware(thunk),
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore)(reducer);

ReactDOM.render(
    <div>
        <Provider store={store}>
            <Router>
                <Route component={App}>
                    <Route path="/" component={TaskListView} />
                    <Route path="/view/:id" component={TaskView} />
                </Route>
            </Router>
        </Provider>
        <DebugPanel top right bottom>
            <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
    </div>
, document.getElementById('app'))
