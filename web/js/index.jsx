/* @flow weak */
import 'whatwg-fetch';
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import Root from './components/Root';
import TaskListView from './components/TaskListView';
import TaskView from './components/TaskView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise';
import reducer from './reducers';
import DevTools from './lib/DevTools';

const store = compose(
    applyMiddleware(promiseMiddleware)
  , DevTools.instrument()
)(createStore)(reducer);

if (module.hot) {
    module.hot.accept('./reducers', () => {
        store.replaceReducer(require('./reducers'));
    });
}

render(
    <Provider store={store}>
        <div>
            <Router history={browserHistory}>
                <Route component={Root}>
                    <Route path="/" component={TaskListView} />
                    <Route path="/view/:id" component={TaskView} />
                </Route>
                <Route path="/register" component={RegisterView} />
            </Router>
            <DevTools/>
        </div>
    </Provider>
, document.getElementById('root'));
