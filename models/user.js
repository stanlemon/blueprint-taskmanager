module.exports = function(sequelize, DataTypes) {
    return sequelize.define('User', {
        username: DataTypes.STRING,
        birthday: DataTypes.DATE
    });
};