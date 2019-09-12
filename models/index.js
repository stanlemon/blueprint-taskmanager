/*eslint no-console: "off"*/
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const fs = require("fs");
const Sequelize = require("sequelize");

module.exports = () => {
    const DEV_DATABASE_PATH = "database.sqlite";
    const DEV_DATABASE_URL = "sqlite://" + DEV_DATABASE_PATH;

    const DATABASE_URL = process.env.DATABASE_URL || DEV_DATABASE_URL;

    const sequelize = new Sequelize(DATABASE_URL, {
        logging: () => null,
        // We don't use this, but it's deprecated and defaults on and I dislike warnings in my console.
        operatorsAliases: false,
    });

    const User = sequelize.define("User", {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "You must enter a name.",
                },
            },
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: "You must enter a valid email address.",
                },
                notEmpty: {
                    msg: "You must enter a email address.",
                },
            },
        },
        token: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [8, 64],
                    msg:
                        "Your password must be between 8 and 64 characters long",
                },
                notEmpty: {
                    msg: "You must enter a password",
                },
            },
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            validate: {
                notEmpty: true,
                isDate: true,
            },
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            validate: {
                notEmpty: true,
                isDate: true,
            },
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
    });

    User.beforeValidate(user => {
        user.token = uuid.v4();
        return Promise.resolve(user);
    });

    User.afterValidate(user => {
        user.password = bcrypt.hashSync(user.password, 10);
        return Promise.resolve(user);
    });

    const Task = sequelize.define("Task", {
        name: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: "You must enter a name for this task.",
                },
            },
        },
        description: Sequelize.STRING,
        due: { type: Sequelize.DATE, defaultValue: null },
        completed: { type: Sequelize.DATE, defaultValue: null },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
    });

    Task.belongsTo(User, { as: "user" });

    // Uncomment this to create a sqlite database file in dev mode
    if (
        DATABASE_URL === DEV_DATABASE_URL &&
        !fs.existsSync(DEV_DATABASE_PATH)
    ) {
        console.log(
            "In DEV mode and a database file doesn't exist yet, so I'm creating one!"
        );
        sequelize.sync({ force: true });
    }

    return {
        sequelize,
        models: {
            User,
            Task,
        },
    };
};
