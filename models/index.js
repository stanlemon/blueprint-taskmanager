"use strict";

var fs         = require("fs");
var path       = require("path");
var Sequelize  = require("sequelize");
var epilogue   = require('epilogue');
var inflection = require('inflection');

module.exports = function(app) {
    var sequelize  = new Sequelize( process.env.DATABASE_URL || 'sqlite://database.sqlite');

    epilogue.initialize({
        base: '/api',
        app: app,
        sequelize: sequelize
    });

    var db        = {};

    fs
        .readdirSync(__dirname)
        .filter(function(file) {
            return (file.indexOf(".") !== 0) && (file !== "index.js");
        })
        .forEach(function(file) {
            var model = sequelize.import(path.join(__dirname, file));
            db[model.name] = model;
        });

    Object.keys(db).forEach(function(modelName) {
        var plural = inflection.pluralize(modelName);

        epilogue.resource({
            model: db[modelName],
            endpoints: [
                '/' + plural,
                '/' + plural + '/:id'
            ]
        });

        if ("associate" in db[modelName]) {
            db[modelName].associate(db);
        }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    return db;
};
