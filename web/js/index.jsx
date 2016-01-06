/* @flow weak */
import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise';
import reducer from './reducers';
import DevTools from './lib/DevTools';
import Routes from './config/Routes';

const middleware = process.env.NODE_ENV !== 'production' ? compose(
    applyMiddleware(promiseMiddleware)
  , DevTools.instrument()
) : applyMiddleware(promiseMiddleware);

const store = middleware(createStore)(reducer);

if (module.hot) {
    module.hot.accept('./reducers', () => {
        store.replaceReducer(require('./reducers'));
    });
}

render(
    <Provider store={store}>
        <div>
            <Router history={browserHistory} routes={Routes} />
            <DevTools/>
        </div>
    </Provider>
, document.getElementById('root'));
