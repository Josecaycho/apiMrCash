module.exports = (sequelize, DataTypes) => {
  let Comissions = sequelize.define('comissions', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    monto: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    }
  }, 
  {
    tableName: 'mrc_comissions',
  },
  {
    timestamps: false
  },
  {
    paranoid: true,
    freezeTableName: true,
  })

  Comissions.associate = function (models) {
    
  };


  return Comissions
}