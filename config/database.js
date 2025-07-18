const { Sequelize } = require('sequelize');
require('dotenv').config();
require('pg');
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

module.exports = {sequelize };
