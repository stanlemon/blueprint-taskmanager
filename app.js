/*eslint no-console: "off"*/
const path = require('path');
const http = require('http');
const express = require('express');
const helmet = require('helmet');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const compression = require('compression');
const morgan = require('morgan');
const finale = require('finale-rest');
const session = require('client-sessions');
const flash = require('connect-flash');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { Strategy: LocalStrategy } = require('passport-local');

const db = require('./models')();

const DEV = 'development';
const ENV = process.env.NODE_ENV || DEV;
const PORT = process.env.PORT || 3000;

const logger = morgan('combined');
const app = express();

app.use(logger);
app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

app.use(
    session({
        cookieName: 'blueprint', // cookie name dictates the key name added to the request object
        requestKey: 'session',
        secret: 'theredballonfloatssouthintheslowwindsofazkaban', // should be a large unguessable string
        duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
        activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, session is extended by activeDuration
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy((username, password, done) => {
        db.models.User.findOne({ where: { email: username } })
            .then(user => {
                if (!user) {
                    return done(null, false, {
                        message: 'Incorrect email or password.',
                    });
                }
                if (!bcrypt.compareSync(password, user.password)) {
                    return done(null, false, {
                        message: 'Incorrect email or password.',
                    });
                }
                return done(null, user);
            })
            .catch(error => done(error, null));
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.models.User.findByPk(id)
        .then(user => {
            done(null, user);
        })
        .catch(error => {
            done(error, null);
        });
});

app.get('/login', (req, res) => {
    const messages = req.flash('error');
    if (messages.length > 0) {
        res.json({
            errors: messages,
        });
    } else {
        res.redirect('/session');
    }
});

app.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true,
    }),
    (req, res) => {
        res.redirect('/session');
    }
);

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/session');
});

app.get('/session', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({
            user: {
                id: req.user.id,
                createdAt: req.user.createdAt,
            },
        });
    } else {
        res.status(401).json({
            user: false,
        });
    }
});

finale.initialize({
    base: '/api',
    app,
    sequelize: db.sequelize,
});

const resources = {
    Task: finale.resource({
        model: db.models.Task,
        endpoints: ['/tasks', '/tasks/:id'],
    }),
    User: finale.resource({
        actions: ['create'],
        model: db.models.User,
        endpoints: ['/users'],
    }),
};

// Require an authenticated user for all operations
resources.Task.all.auth((req, res, context) => {
    // We optionally let a bearer token be passed in, and we'll log the user in using that'
    if (req.headers && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');

        if (parts.length === 2) {
            const scheme = parts[0];
            const token = parts[1];

            if (/^Bearer$/i.test(scheme)) {
                db.models.User.findOne({ where: { token } }).then(user => {
                    if (user) {
                        req.login(user, () => context.continue());
                    } else {
                        res.status(401).send({ message: 'Unauthorized' });
                        context.stop();
                    }
                });
            }
        }
    } else if (req.isAuthenticated()) {
        context.continue();
    } else {
        context.error(403, 'You must be logged in to access this resource.');
    }
});

// Restrict all fetch requests to the authenticated user
resources.Task.all.fetch_before((req, res, context) => {
    req.query.userId = req.user.id;
    return context.continue;
});

// Set the authenticated user on all writes
resources.Task.create.write.before((req, res, context) => {
    req.body.userId = req.user.id;
    return context.continue;
});

// Auto login a user after they register
resources.User.create.write.after((req, res, context) => {
    req.login(context.instance, err => {
        if (err) {
            console.error(err);
        }
    });

    return context.continue;
});

if (ENV === DEV) {
    /* eslint-disable global-require, import/no-extraneous-dependencies */
    const Bundler = require('parcel-bundler');

    const file = path.join(__dirname, 'web', 'index.html');
    const options = {};

    // Initialize a new parcel bundler
    const bundler = new Bundler(file, options);

    // This will let Parcel handle every request to the express server not already defined
    app.use(bundler.middleware());
    /* eslint-enable */
} else {
    app.use(
        serveStatic(path.join(__dirname, 'dist'), { index: ['index.html'] })
    );
}

app.listen();

const server = http.createServer(app);

server.listen(PORT, err => {
    if (err) {
        console.error(err);
        return;
    }

    const host =
        server.address().address === '::'
            ? 'localhost'
            : server.address().address;
    const port = server.address().port;

    console.log('Starting in %s mode', ENV);
    console.log('Listening at http://%s:%s', host, port);
});
