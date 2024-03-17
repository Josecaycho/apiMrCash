module.exports = (sequelize, DataTypes) => {
  let TypesAccount = sequelize.define('typesAccount', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    account_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    digits: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mrc_bank_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, 
  {
    tableName: 'mrc_type_account',
  },
  {
    timestamps: false
  },
  {
    paranoid: true,
    freezeTableName: true,
  })

  TypesAccount.associate = function (models) {
    TypesAccount.belongsTo(models.bank, {
      foreignKey: 'mrc_bank_id'
    })
    TypesAccount.hasMany(models.userBank, {
      foreignKey: 'mrc_type_account_id'
    })
    TypesAccount.hasMany(models.order, {
      foreignKey: 'type_account_id'
    })
  };


  return TypesAccount
}