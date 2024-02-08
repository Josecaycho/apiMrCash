'use strict';
require("dotenv").config();
const fs = require('fs');
const path = require('path');
const {Sequelize,DataTypes} = require('sequelize');
const basename = path.basename(__filename);

const sequelize = new Sequelize(process.env.DATABASE, process.env.USER_CONECTION, process.env.PASSWORD, {
  host: process.env.Host,
  dialect: "mysql",
  port: 3306,
  define: {
    timestamps: false
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

// db.Sequelize = Sequelize
// db.sequelize = sequelize

// db.orders = require('./order.js')(sequelize, DataTypes)
// db.banks = require('./bank.js')(sequelize, DataTypes)

// db.sequelize.sync({ force: false })
// .then(() => {
//     console.log('yes re-sync done!')
// })

// // 1 to Many Relation

// db.orders.hasMany(db.banks, {
//     foreignKey: 'mrc_bank_id',
//     as: 'bank'
// })

// db.banks.belongsTo(db.orders, {
//     foreignKey: 'mrc_bank_id',
//     as: 'mrc_banks'
// })

// module.exports = db;