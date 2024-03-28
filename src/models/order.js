const models = require("./index")
// const Bank = require('./bank');
module.exports = (sequelize, DataTypes) => {
  let Order = sequelize.define('order', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    mrc_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    monto_send: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    monto_receive: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    percentage:{
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    monto_comision:{
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false
    },
    number_operation:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    number_account: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bank_id:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type_account_id:{
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'mrc_orders',
  },
  {
    timestamps: false
  },
  {
    paranoid: true,
    freezeTableName: true,
  })
  Order.associate = function (models) {
    Order.belongsTo(models.bank, {
      foreignKey: 'mrc_bank_id'
    })
    Order.belongsTo(models.userBank, {
      foreignKey: 'mrc_user_bank_id'
    })
    Order.belongsTo(models.user, {
      foreignKey: 'mrc_user_id',
      onDelete: 'CASCADE'
    })
    Order.belongsTo(models.typesAccount, {
      foreignKey: 'type_account_id'
    })
    Order.belongsTo(models.bankUser, {
      foreignKey: 'bank_id'
    })
    Order.hasMany(models.historyOrder, {
      foreignKey: 'mrc_order_id'
    })
  };

  return Order
}