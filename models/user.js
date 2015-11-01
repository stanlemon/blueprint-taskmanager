export default (sequelize, DataTypes) => {
    return sequelize.define('User', {
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        birthday: DataTypes.DATE
    });
}
