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
  };


  return TypesAccount
}