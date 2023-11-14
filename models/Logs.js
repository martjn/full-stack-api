module.exports = (sequelize, DataTypes) => {
  const Logs = sequelize.define("Logs", {
    action: {
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
    }
  })

  return Logs
}