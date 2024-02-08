module.exports = (sequelize, DataTypes) => {
  let Bank = sequelize.define('bank', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name_bank: {
      type: DataTypes.STRING,
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, 
  {
    tableName: 'mrc_banks',
  },
  {
    timestamps: false
  },
  {
    paranoid: true,
    freezeTableName: true,
  })

  Bank.associate = function (models) {
    Bank.hasMany(models.order, {
      foreignKey: 'mrc_bank_id'
    })
    Bank.hasMany(models.userBank, {
      foreignKey: 'mrc_bank_id'
    })
  };


  return Bank
}