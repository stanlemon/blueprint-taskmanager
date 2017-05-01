import React from 'react';
import { render } from 'react-dom';
import { Router, IndexRoute, Route, hashHistory, createMemoryHistory, withRouter } from 'react-router';
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import injectTapEventPlugin from 'react-tap-event-plugin';
import reducer from './reducers';
import UserService from './lib/UserService';
import TaskService from './lib/TaskService';
import DevTools from './lib/DevTools';
import Root from './components/Root';
import Layout from './components/Layout';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import TaskListView from './components/TaskListView';
import TaskView from './components/TaskView';

injectTapEventPlugin();

const services = {
    userService: new UserService(),
    taskService: new TaskService(),
};

const middleware = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test' ? compose(
    applyMiddleware(thunk.withExtraArgument(services))
, DevTools.instrument()
) : applyMiddleware(thunk.withExtraArgument(services));

const store = middleware(createStore)(reducer);

if (module.hot) {
    module.hot.accept('./reducers', () => {
        store.replaceReducer(require('./reducers')); // eslint-disable-line global-require
    });
}

const history = process.env.NODE_ENV === 'test' ? createMemoryHistory() : hashHistory;

const App = (
    <Provider store={store}>
        <div>
            <Router history={history}>
                <Route component={withRouter(Root)}>
                    <Route path="/login" component={LoginView} />
                    <Route path="/register" component={RegisterView} />
                    <Route path="/" component={Layout}>
                        <IndexRoute component={TaskListView} />
                        <Route path="view/:id" component={TaskView} />
                    </Route>
                </Route>
            </Router>
            <DevTools />
        </div>
    </Provider>
);

render(App, document.getElementById('root'));
