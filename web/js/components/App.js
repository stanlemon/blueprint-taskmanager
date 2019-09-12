import React from 'react';
import { Provider } from 'react-redux';
import Routes from './Routes';
import { hot } from 'react-hot-loader';
import store from '../store';

export function App() {
    return (
        <Provider store={store}>
            <Routes />
        </Provider>
    );
}

export default hot(module)(App);
