const bcrypt = require('bcrypt');
const uuid = require('uuid');
const Sequelize = require('sequelize');

module.exports = () => {
    const sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite://database.sqlite', { logging: () => null });

    const User = sequelize.define('User', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'You must enter a name.',
                },
            },
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: 'You must enter a valid email address.',
                },
                notEmpty: {
                    msg: 'You must enter a email address.',
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
                    msg: 'Your password must be between 8 and 64 characters long',
                },
                notEmpty: {
                    msg: 'You must enter a password',
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

    User.beforeValidate((user) => {
        user.token = uuid.v4();
        return Promise.resolve(user);
    });

    User.afterValidate((user) => {
        user.password = bcrypt.hashSync(user.password, 10);
        return Promise.resolve(user);
    });

    const Task = sequelize.define('Task', {
        name: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: 'You must enter a name for this task.',
                },
            },
        },
        description: Sequelize.STRING,
        due: Sequelize.DATE,
        completed: Sequelize.DATE,
    });

    Task.belongsTo(User, { as: 'user' });

    // Uncomment this to create a sqlite database file in dev mode
    // sequelize.sync({ force: true });

    return {
        sequelize,
        models: {
            User,
            Task,
        },
    };
};
