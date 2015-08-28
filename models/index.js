"use strict";

var fs         = require("fs");
var path       = require("path");
var Sequelize  = require("sequelize");

module.exports = function(app) {
    var db = {
        sequelize: new Sequelize(process.env.DATABASE_URL || 'sqlite://database.sqlite'),
        models: {},
        resources: {}
    };

    fs
        .readdirSync(__dirname)
        .filter(function(file) {
            return (file.indexOf(".") !== 0) && (file !== "index.js");
        })
        .forEach(function(file) {
            var model = db.sequelize.import(path.join(__dirname, file));
            db.models[model.name] = model;
        });

    Object.keys(db.models).forEach(function(modelName) {
        if ("associate" in db.models[modelName]) {
            db.models[modelName].associate(db);
        }
    });

    return db;
};
