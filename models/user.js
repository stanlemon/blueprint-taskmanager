"use strict";

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        username: DataTypes.STRING,
        birthday: DataTypes.DATE
    });
};
