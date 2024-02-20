module.exports = (sequelize, DataTypes) => {
  let Rol = sequelize.define('rol', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, 
  {
    tableName: 'mrc_roles',
  },
  {
    timestamps: false
  },
  {
    paranoid: true,
    freezeTableName: true,
  })

  Rol.associate = function (models) {
    Rol.hasMany(models.user,{ 
      foreignKey: 'id_rol' 
    })
  };


  return Rol
}