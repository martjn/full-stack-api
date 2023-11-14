module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  Users.associate = (models) => {
    Users.hasMany(models.Likes, {
      onDelete: "cascade",
    });
  };

  // Define a hook to log changes to the Results table
  Users.addHook("afterCreate", async (user, options) => {
    // Log the creation action to the Results table
    await Logs.create({
      action: "create",
      modelName: "Users",
      invokerId: user.id,
    });
  });
  // Define a hook to log changes to the Results table
  Users.addHook("afterUpdate", async (user, options) => {
    // Log the creation action to the Results table
    await Logs.create({
      action: "update",
      modelName: "Users",
      invokerId: user.id,
    });
  });
  // Define a hook to log changes to the Results table
  Users.addHook("afterDestroy", async (user, options) => {
    // Log the creation action to the Results table
    await Logs.create({
      action: "destroy",
      modelName: "Users",
      invokerId: user.id,
    });
  });
  return Users;
};
