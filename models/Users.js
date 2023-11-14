const SequelizeAudit = require("sequelize-audit");

module.exports = (sequelize, DataTypes, models) => {
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

  SequelizeAudit(Users, {
    strategy: "all",
  });

  Users.associate = (models) => {
    Users.hasMany(models.Likes, {
      onDelete: "cascade",
    });
  };

  return Users;
};
