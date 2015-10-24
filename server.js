"use strict";

var path         = require('path');
var http         = require('http');
var express      = require('express');
var serveStatic  = require('serve-static');
var bodyParser   = require('body-parser');
var morgan       = require('morgan');
var webpack      = require('webpack');
var config       = require('./webpack.config');
var epilogue     = require('epilogue');
var inflection   = require('inflection');

var app          = express();
var logger       = morgan('combined');
var compiler     = webpack(config);
var db           = require("./models")(app);

const PROD = 'production';
const DEV = 'development;'

let env = process.env.NODE_ENV === undefined ? DEV : process.env.NODE_ENV;

app.set('port', (process.env.PORT || 3000));

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

var db = require("./models")(app);

epilogue.initialize({
    base: '/api',
    app: app,
    sequelize: db.sequelize
});

Object.keys(db.models).forEach(function(modelName) {
    var plural = inflection.pluralize(modelName);

    db.resources[modelName] = epilogue.resource({
        model: db.models[modelName],
        endpoints: [
            '/' + plural,
            '/' + plural + '/:id'
        ]
    });
});

db.sequelize.sync()
    .then(function() {
        var server = http.createServer(app);

        server.listen(app.get('port'), function(err) {
            if (err) {
                console.log(err);
                return;
            }

            var host = server.address().address;
            var port = server.address().port;

            if (host == '::') host = 'localhost';

            console.log('Listening at http://%s:%s', host, port);
        });
    })
;
