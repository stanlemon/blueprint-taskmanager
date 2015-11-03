"use strict";

let fs         = require("fs");
let path       = require("path");
let Sequelize  = require("sequelize");

module.exports = () => {
    let sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite://database.sqlite');

    let User = sequelize.define('User', {
        username: Sequelize.STRING,
        password: Sequelize.STRING,
        //birthday: Sequelize.DATE
    });

    let Task = sequelize.define('Task', {
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        due: Sequelize.DATE,
        completed: Sequelize.DATE
    });

    Task.belongsTo(User, { as: 'user' });

    return {
        sequelize: sequelize,
        models: {
            User: User,
            Task: Task
        }
    }
}
