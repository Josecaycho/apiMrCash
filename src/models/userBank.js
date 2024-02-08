module.exports = (sequelize, DataTypes) => {
  let userBank = sequelize.define('userBank', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    number_account: {
      type: DataTypes.STRING,
      allowNull: false
    },
    alias_account: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type_money: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    account_holder: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mrc_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, 
  {
    tableName: 'mrc_user_banks',
  },
  {
    timestamps: false
  },
  {
    paranoid: true,
    freezeTableName: true,
  })

  userBank.associate = function (models) {
    userBank.hasMany(models.order, {
      foreignKey: 'mrc_user_bank_id'
    })
    userBank.belongsTo(models.bank, {
      foreignKey: 'mrc_bank_id'
    })
  };


  return userBank
}