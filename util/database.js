const Sequelize = require('sequelize')

const sequelize = new Sequelize('node-complete', 'root', '#password09', { dialect: 'mysql', host: 'localhost' })


module.exports = sequelize;