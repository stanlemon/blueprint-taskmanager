var path         = require('path')
  , express      = require('express')
  , serveStatic  = require('serve-static')
  , bodyParser   = require('body-parser')
  , morgan       = require('morgan')
  , webpack      = require('webpack')
  , config       = require('./webpack.config')
  , sequelize    = require('sequelize')
  , epilogue     = require('epilogue')
;

var app = express();
var logger = morgan('combined');
var compiler = webpack(config);
var db = new sequelize( process.env.DATABASE_URL || 'sqlite://database.sqlite');

var User = db.define('User', {
  username: sequelize.STRING,
  birthday: sequelize.DATE
});

epilogue.initialize({
  base: '/api',
  app: app,
  sequelize: db
});

epilogue.resource({
  model: User,
  endpoints: ['/users', '/users/:id']
});

app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));
app.use(serveStatic(path.join(__dirname, 'web'), {'index': ['index.html']}))
app.use(require('webpack-hot-middleware')(compiler));

db.sync()
    .then(function() {
        var server = app.listen(3000, 'localhost', function (err) {
            if (err) {
                console.log(err);
                return;
            }

            var host = server.address().address,
                port = server.address().port;

            console.log('listening at http://%s:%s', host, port);

            // Test creating a user record
            User.create({
                username: 'janedoe',
                birthday: new Date(1980, 6, 20)
              });
        });
    })
;

