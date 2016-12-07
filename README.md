# Blueprint Task Manager
Blueprint started as my playground to experiment with [ES6](http://es6-features.org) and [React](https://facebook.github.io/react/).  Eventually I added [Redux](http://redux.js.org) and other javascript centric technologies I wanted to know more about. I wanted to start from scratch and build a  semi-real application to experiment with, something more then [TodoMVC](http://todomvc.com) but still along those lines. I wanted the app to be a [single-page application](https://en.wikipedia.org/wiki/Single-page_application) with user authentication and yet still be relatively simple in its focus.

I am regularly making changes to this application as I explore new javascript technologies.

## Under the Hood

_Blueprint is a [single-page application](https://en.wikipedia.org/wiki/Single-page_application) built with [React](https://facebook.github.io/react/) that uses [Redux](http://redux.js.org) for state management against a REST API._ [Babel](http://babeljs.io) and [Webpack](http://webpack.github.io) are used to compile from the latest [ES6](http://es6-features.org). Linting is done with [ESLint](http://eslint.org). When deploying it uses [CircleCI](http://circleci.com) to run tests written with [Jest](http://facebook.github.io/jest/) before pushing to [Heroku](https://www.heroku.com).  On Heroku a [Postgres](https://www.postgresql.org) database is used as a system of record.

The server component of the application is an [express](http://expressjs.com) app using [epilogue](https://github.com/dchester/epilogue) for exposing [sequelize](http://sequelizejs.com) models as rest endpoints and authentication with [passport](http://passportjs.org).

During development [Webpack](http://webpack.github.io) is configured to [hot-reload](http://webpack.github.io/docs/hot-module-replacement-with-webpack.html) javascript components. Combined with Redux this makes the experience "save and see".  It does not hot load javascript, but it does support [LESS](http://lesscss.org) compilation.  Locally [sqlite](https://www.sqlite.org) is used as a system of record, which should work out of the box without additional configuration.

## Running & Tooling

To get started, simply:

    npm install
    npm start

You can run tests by doing:

    npm test

You can lint the source by doing:

    npm run lint

You can build the production assets by doing:

    npm run build

You can start the production version of the app by doing:

    NODE_ENV=production npm start

## Try it out

If you want to checkout a running instance of Blueprint, go to [http://blueprint-taskmanager.herokuapp.com](http://blueprint-taskmanager.herokuapp.com)

Once you're there click the 'Register' link to setup an account.

Feedback is welcome, drop me a line or a [tweet](http://twitter.com/stanlemon).


