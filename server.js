var path         = require('path')
  , express      = require('express')
  , serveStatic  = require('serve-static')
  , bodyParser   = require('body-parser')
  , morgan       = require('morgan')
  , webpack      = require('webpack')
  , config       = require('./webpack.config')
;

var app = express();
var logger = morgan('combined');
var compiler = webpack(config);

var db = require("./models")(app);

app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));
app.use(serveStatic(path.join(__dirname, 'web'), {'index': ['index.html']}))
app.use(require('webpack-hot-middleware')(compiler));

db.sequelize.sync()
    .then(function() {
        var server = app.listen(3000, 'localhost', function (err) {
            if (err) {
                console.log(err);
                return;
            }

            var host = server.address().address,
                port = server.address().port;

            console.log('Listening at http://%s:%s', host, port);
        });
    })
;

