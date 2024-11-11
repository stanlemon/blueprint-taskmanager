# Blueprint Task Manager

Blueprint started as my playground to experiment with [ES6](http://es6-features.org) and [React](https://facebook.github.io/react/).  Eventually I added [Redux](http://redux.js.org) and other javascript technologies that I wanted to learn how to use. I wanted to start from scratch and build a  semi-real application to experiment with, something more complex than [TodoMVC](http://todomvc.com) but along similar lines. I wanted the app to be a [single-page application](https://en.wikipedia.org/wiki/Single-page_application) with a custom backend that had user authentication.

## Under the Hood

_Blueprint is a [single-page application](https://en.wikipedia.org/wiki/Single-page_application) built with [React](https://facebook.github.io/react/) that uses [Redux](http://redux.js.org) for state management against a REST API._ [Babel](http://babeljs.io) and [Parcel](http://parceljs.org) are used to build assets using the [latest Javascript features](https://developer.mozilla.org/en-US/docs/Web/JavaScript). Coding style is enforced with [ESLint](http://eslint.org) and [Prettier](https://prettier.io). Tests are written with [Jest](http://facebook.github.io/jest/) and run on using GitHub actions. Locally when developing I use [SQLite](http://sqlite.org), but I also test using [Postgres](https://www.postgresql.org).

The server component of the application uses [express](http://expressjs.com) and authentication is managed with [passport](http://passportjs.org). All of the database interactivity is done using [knex](http://knexjs.org).

## Running & Tooling

To get started, simply:

    npm install
    npm run dev

You can run tests by doing:

    npm test

You can run an end to end test using [playwright](http://playwright.dev) by doing:

    npm run test-e2e

You can lint the source by doing:

    npm run lint

You can build the production assets by doing:

    npm run build

You can start the production version of the app by doing:

    NODE_ENV=production npm start

## Feedback

Drop me a line at [tweet](http://twitter.com/stanlemon).
