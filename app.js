"use strict";

let path         = require('path');
let http         = require('http');
let express      = require('express');
let helmet       = require('helmet');
let serveStatic  = require('serve-static');
let bodyParser   = require('body-parser');
let morgan       = require('morgan');
let webpack      = require('webpack');
let config       = require('./webpack.config');
let epilogue     = require('epilogue');
let inflection   = require('inflection');
let session      = require('express-session')
let passport     = require('passport');
let localStrategy = require('passport-local').Strategy;

let app          = express();
let logger       = morgan('combined');
let compiler     = webpack(config);
let db           = require("./models")(app);

const PROD = 'production';
const DEV = 'development'

let env = process.env.NODE_ENV || DEV;

app.set('port', (process.env.PORT || 3000));

app.use(helmet.hidePoweredBy());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.frameguard());
app.use(helmet.xssfilter());
//app.use(helmet.hsts());

app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(serveStatic(path.join(__dirname, 'web'), {'index': ['index.html']}));

if (env === DEV) {
    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
    }));
    app.use(require('webpack-hot-middleware')(compiler));
}

app.use(session({
    secret: 'theredballonfloatssouthintheslowwindsofazkaban',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(
  (username, password, done) => {
    db.models.User.findOne({ where: { username: username } }).then( (user) => {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password !== password){
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    }).catch( (error) => {
      console.log(error);
      return done(error, null);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.models.User.findById(id).then( (user) => {
    done(null, user);
  }).catch( (error) => {
    console.log(error);
    done(error, null);
  });
});

app.get('/login', (req, res) => {
  res.redirect('/session');
});

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/session');
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/session');
});

app.get('/session', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      user: req.user
    });
  } else {
    res.status(401).json({
      user: false
    })
  }
});

app.get('/ping', (req, res) => {
  res.status(200).send("pong!");
});

app.get('/secure', isAuthenticated, (req, res) => {
  res.status(200).send("login!");
});


epilogue.initialize({
    base: '/api',
    app: app,
    sequelize: db.sequelize
});

for (let model in db.models) {
    let plural = inflection.pluralize(model);

    db.resources[model] = epilogue.resource({
        model: db.models[model],
        endpoints: [
            '/' + plural,
            '/' + plural + '/:id'
        ]
    });
}

db.sequelize.sync( /*{ force: true }*/ )
    .then( () => {
        let server = http.createServer(app);

        server.listen(app.get('port'), err => {
            if (err) {
                console.log(err);
                return;
            }

            let host = server.address().address;
            let port = server.address().port;

            if (host == '::') host = 'localhost';

            console.log('Starting in ' + env + ' mode');
            console.log('Listening at http://%s:%s', host, port);
        });
    })
;

function isAuthenticated(req, res, next)  {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}
