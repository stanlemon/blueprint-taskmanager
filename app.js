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

let app          = express();
let logger       = morgan('combined');
let compiler     = webpack(config);
let db           = require("./models")(app);

const PROD = 'production';
const DEV = 'development;'

let env = process.env.NODE_ENV || DEV;

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

helmet(app);

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

db.sequelize.sync()
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

            console.log('Listening at http://%s:%s', host, port);
        });
    })
;
