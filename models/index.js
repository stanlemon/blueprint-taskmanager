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
            allowNull: false,
            unique: true,
            validate:  {
                isEmail: true,
                notEmpty: true
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            set: function(value) {
                let hash = bcrypt.hashSync(value, 10);

                this.setDataValue('password', hash);
            },
            validate:  {
                notEmpty: true
            }
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            validate:  {
                notEmpty: true,
                isDate: true
            }
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            validate:  {
                notEmpty: true,
                isDate: true
            }
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    });

    let Task = sequelize.define('Task', {
        name: {
            type: Sequelize.STRING,
            validate:  {
                notEmpty: true
            }
        },
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
