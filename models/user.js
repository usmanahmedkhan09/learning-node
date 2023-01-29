const { Sequelize, DataTypes } = require('sequelize')

const sequelize = require('../util/database')

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING
})

module.exports = User