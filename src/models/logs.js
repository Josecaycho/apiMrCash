module.exports = (sequelize, DataTypes) => {
  let Logs = sequelize.define('logs', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    ruta: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    }
  }, 
  {
    tableName: 'mrc_logs',
  },
  {
    timestamps: false
  },
  {
    paranoid: true,
    freezeTableName: true,
  })

  Logs.associate = function (models) {
    
  };


  return Logs
}