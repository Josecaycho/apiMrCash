module.exports = (sequelize, DataTypes) => {
  let BankUser = sequelize.define('bankUser', {
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
    info: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    }
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

  BankUser.associate = function (models) {
    BankUser.hasMany(models.order, {
      foreignKey: 'bank_id'
    })
  };


  return BankUser
}