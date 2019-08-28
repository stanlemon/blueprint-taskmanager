import React from 'react';
import {
    compose,
    createStore,
    applyMiddleware,
    bindActionCreators,
} from 'redux';
import { connect, Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from '../reducers/';
import UserService from '../lib/UserService';
import TaskService from '../lib/TaskService';
import * as actions from '../actions/';
import Routes from './Routes';

const services = {
    userService: new UserService(),
    taskService: new TaskService(),
};

const store = compose(applyMiddleware(thunk.withExtraArgument(services)))(
    createStore
)(reducer);

export default function App() {
    return (
        <Provider store={store}>
            <div>
                {React.createElement(
                    connect(
                        state => state,
                        dispatch => ({
                            actions: bindActionCreators(actions, dispatch),
                        })
                    )(Routes)
                )}
            </div>
        </Provider>
    );
}
