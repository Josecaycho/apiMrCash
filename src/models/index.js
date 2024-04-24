'use strict';
require("dotenv").config();
const fs = require('fs');
const path = require('path');
const {Sequelize,DataTypes} = require('sequelize');
const basename = path.basename(__filename);

const sequelize = new Sequelize(process.env.DATABASE, process.env.USER_CONECTION, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: "mysql",
  port: 3306,
  timezone: '-05:00',
  define: {
    timestamps: false
  },
  dialectOptions: {
    useUTC: false
  }
});

const db = {}
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize.sync(); // actualiza la base de datos cuando hay cambios en las tablas

module.exports = db;