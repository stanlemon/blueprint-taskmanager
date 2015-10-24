import 'babel-core/polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'react-router';
import App from './components/App';
import TaskListView from './components/TaskListView';
import TaskView from './components/TaskView';
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise';
import reducer from './reducers';
import { createDevTools, persistState } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

let DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey='H' changePositionKey='Q'>
    <LogMonitor />
  </DockMonitor>
);

const store = compose(
    applyMiddleware(promiseMiddleware),
    DevTools.instrument(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore)(reducer);

if (module.hot) {
    module.hot.accept('./reducers', () => {
        store.replaceReducer(require('./reducers'));
    });
}

render(
    <Provider store={store}>
        <div>
            <Router>
                <Route component={App}>
                    <Route path="/" component={TaskListView} />
                    <Route path="/view/:id" component={TaskView} />
                </Route>
            </Router>
            <DevTools/>
        </div>
    </Provider>
, document.getElementById('root'))
