"use strict";

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Task', {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        due: DataTypes.DATE,
        completed: DataTypes.DATE
    });
};
