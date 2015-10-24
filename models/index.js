"use strict";

let fs         = require("fs");
let path       = require("path");
let Sequelize  = require("sequelize");

module.exports = app => {
    let db = {
        sequelize: new Sequelize(process.env.DATABASE_URL || 'sqlite://database.sqlite'),
        models: {},
        resources: {}
    };

    fs
        .readdirSync(__dirname)
        .filter( file => {
            return (file.indexOf(".") !== 0) && (file !== "index.js");
        })
        .forEach( file => {
            let model = db.sequelize.import(path.join(__dirname, file));
            db.models[model.name] = model;
        });

    for (let model in db.models) {
        if ("associate" in db.models[model]) {
            db.models[model].associate(db);
        }
    }

    return db;
};
