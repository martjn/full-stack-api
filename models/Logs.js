module.exports = (sequelize, DataTypes) => {
  const Logs = sequelize.define("Logs", {
    actionType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    modelName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invokerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  })

  return Logs
}