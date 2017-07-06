import React from 'react';
import { render } from 'react-dom';
import {
    HashRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import injectTapEventPlugin from 'react-tap-event-plugin';
import reducer from './reducers';
import UserService from './lib/UserService';
import TaskService from './lib/TaskService';
import Root from './components/Root';
import Layout from './components/Layout';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import TaskListView from './components/TaskListView';
import TaskView from './components/TaskView';
/*eslint-disable */
import DevTools from './lib/DevTools';
/*eslint-enable */

injectTapEventPlugin();

const services = {
    userService: new UserService(),
    taskService: new TaskService(),
};

const middleware =
    process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test'
        ? compose(
              applyMiddleware(thunk.withExtraArgument(services)),
              DevTools.instrument()
          )
        : applyMiddleware(thunk.withExtraArgument(services));

const store = middleware(createStore)(reducer);

if (module.hot) {
    module.hot.accept('./reducers', () => {
        store.replaceReducer(require('./reducers')); // eslint-disable-line global-require
    });
}

import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as _actions from './actions/';

//const actions = bindActionCreators(_actions, store.dispatch);


const A = connect(
    state => state,
    dispatch => ({ actions: bindActionCreators(_actions, dispatch) })
)((props) => {
    console.log('Connected', props)
    return (
        <Router>
            <Root>
                <Switch>
                    <Route path="/login" render={(router) =>
                        <LoginView {...props} router={router} />
                    } />
                    <Route path="/register" render={(router) =>
                        <RegisterView {...props} router={router} />
                    } />
                    <Route path="/" render={(router) =>
                        <Layout {...props} router={router}>
                            <Switch>
                                <Route exact path="/" render={(router) =>
                                    <TaskListView {...props} router={router} />
                                }/>
                                <Route exact path="/view/:id" render={(router) =>
                                    <TaskView {...props} router={router} />
                                }/>
                            </Switch>
                        </Layout>
                    } />
                </Switch>
            </Root>
        </Router>
    )
})

const App = (
    <Provider store={store}>
        <A />
    </Provider>
);

render(App, document.getElementById('root'));
