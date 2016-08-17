/* eslint-disable indent */
import { withRouter } from 'react-router';
import Root from '../components/Root';
import Layout from '../components/Layout';
import LoginView from '../components/LoginView';
import TaskListView from '../components/TaskListView';

export default [
  {
    component: withRouter(Root),
    childRoutes: [
      {
        component: Layout,
        childRoutes: [
          {
            path: '/',
            component: TaskListView,
          },
          {
            path: '/view/:id',
            // Tells webpack to chunk this view
            getComponent: (location, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../components/TaskView').default);
              });
            },
          },
        ],
      },
      {
        path: '/login',
        component: LoginView,
      },
      {
        path: '/register',
        // Tells webpack to chunk this view
        getComponent: (location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../components/RegisterView').default);
          });
        },
      },
    ],
  },
];
