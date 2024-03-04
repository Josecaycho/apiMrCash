module.exports = (sequelize, DataTypes) => {
  let userFiles = sequelize.define('userFiles', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    dni_frontal:{
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    dnir_later:{
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    photo:{
      type: DataTypes.TEXT('long'),
      allowNull: false
    }
  }, 
  {
    tableName: 'mrc_user_files',
  },
  {
    timestamps: false
  },
  {
    paranoid: true,
    freezeTableName: true,
  })

  userFiles.associate = function (models) {
    userFiles.belongsTo(models.user,{ 
      foreignKey: 'mrc_user_id' 
    })
  };


  return userFiles
}