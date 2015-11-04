import 'babel-core/polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'react-router';
import App from './components/App';
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
  //, persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
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
                <Route path="/login" component={LoginView} />
                <Route path="/register" component={RegisterView} />
            </Router>
            <DevTools/>
        </div>
    </Provider>
, document.getElementById('root'))
