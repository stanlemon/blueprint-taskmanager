"use strict";

let fs         = require("fs");
let path       = require("path");
let bcrypt     = require('bcrypt');

let Sequelize  = require("sequelize");

module.exports = () => {
    let sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite://database.sqlite');

    let User = sequelize.define('User', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            set: function(value) {
                let hash = bcrypt.hashSync(value, 10);

                this.setDataValue('password', hash);
            }
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: 1
        }
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
