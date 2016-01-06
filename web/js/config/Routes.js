/* eslint-disable indent */
/* @flow weak */
import Root from '../components/Root';
import App from '../components/App';
import LoginView from '../components/LoginView';
import TaskListView from '../components/TaskListView';

export default [
  {
    component: Root,
    childRoutes: [
      {
        component: App,
        childRoutes: [
          {
            path: '/',
            component: TaskListView
          },
          {
            path: '/view/:id',
            // Tells webpack to chunk this view
            getComponent: (location, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../components/TaskView').default);
              });
            }
          }
        ]
      },
      {
        path: '/login',
        component: LoginView
      },
      {
        path: '/register',
        // Tells webpack to chunk this view
        getComponent: (location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../components/RegisterView').default);
          });
        }
      }
    ]
  }
];
