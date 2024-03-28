module.exports = (sequelize, DataTypes) => {
  let HistoryOrder = sequelize.define('historyOrder', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    mrc_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mrc_order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    state_order: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, 
  {
    tableName: 'mrc_history_order_update',
  },
  {
    timestamps: false
  },
  {
    paranoid: true,
    freezeTableName: true,
  })

  HistoryOrder.associate = function (models) {
    HistoryOrder.belongsTo(models.order,{ 
      foreignKey: 'mrc_order_id' 
    })
    HistoryOrder.belongsTo(models.user,{ 
      foreignKey: 'mrc_user_id' 
    })
  };


  return HistoryOrder
}