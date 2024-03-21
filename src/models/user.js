module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define('user', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    dni: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nombres: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comision: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, 
  {
    tableName: 'mrc_user',
  },
  {
    timestamps: false
  },
  {
    paranoid: true,
    freezeTableName: true,
  })

  User.associate = function (models) {
    User.belongsTo(models.rol, {
      foreignKey: 'id_rol'
    })
    User.hasMany(models.userBank, {
      foreignKey: 'mrc_user_id'
    })
    User.hasOne(models.userFiles, {
      foreignKey: 'mrc_user_id'
    })
    User.hasMany(models.order, {
      foreignKey: 'mrc_user_id',
      onDelete: 'CASCADE'
    })
  };


  return User
}