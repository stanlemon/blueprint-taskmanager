import React from 'react';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router';
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import injectTapEventPlugin from 'react-tap-event-plugin';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import reducer from './reducers';
import DevTools from './lib/DevTools';
import Routes from './config/Routes';
import UserService from './lib/UserService';
import TaskService from './lib/TaskService';

injectTapEventPlugin();

momentLocalizer(moment);

const services = {
    userService: new UserService(),
    taskService: new TaskService(),
};

const middleware = process.env.NODE_ENV !== 'production' ? compose(
    applyMiddleware(thunk.withExtraArgument(services))
  , DevTools.instrument()
) : applyMiddleware(thunk.withExtraArgument(services));

const store = middleware(createStore)(reducer);

if (module.hot) {
    module.hot.accept('./reducers', () => {
        store.replaceReducer(require('./reducers')); // eslint-disable-line global-require
    });
}

render(
    <Provider store={store}>
        <div>
            <Router history={hashHistory} routes={Routes} />
            <DevTools />
        </div>
    </Provider>
, document.getElementById('root'));
