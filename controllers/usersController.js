const express = require("express");
const router = express.Router();
const { Users, Logs } = require("../models");
const { Posts, Likes } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");

const { sign } = require("jsonwebtoken");

async function createUser(req, res) {
  const { username, password } = req.body;

  try {
    const user = await Users.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      const hash = await bcrypt.hash(password, 10);

      // Use await here to make sure the user is created before moving on
      await Users.create({
        username: username,
        password: hash,
      });

      // Now that the user is created, create a log entry
      await Logs.create({
        actionType: "insert",
        modelName: "Users",
        invokerId: null,
        description: `Registered user: "${username}"`,
      });

      res.json({ status: "success" });
    } else {
      res.json({ status: "user_already_exists" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: "error" });
  }
}

async function loginUser(req, res) {
  const { username, password } = req.body;
  const user = await Users.findOne({
    where: {
      username: username,
    },
  });

  if (!user) res.json({ error: "user_no_exist" });
  bcrypt.compare(password, user.password).then((match) => {
    if (!match) res.json({ error: "wrong_password" });

    const accessToken = sign(
      { username: user.username, id: user.id },
      "important_secret"
    );
    res.json({ token: accessToken, username: username, id: user.id });
  });
}

const getUserDetails = async (req, res) => {
  res.json(req,user)
}

const getUserAssociatedPosts = async (req, res) => {
  let order = [["createdAt", "DESC"]];
  const id = req.params.id;

  const basicInfo = await Users.findByPk(id);
  const associatedPosts = await Posts.findAll({
    where: {
      username: basicInfo.username,
    },
    include: [Likes],
    order,
  });
  const likedPosts = await Likes.findAll({
    where: {
      UserId: id,
    },
  });
  res.json({
    id: basicInfo.id,
    username: basicInfo.username,
    createdAt: basicInfo.createdAt,
    associatedPosts: associatedPosts,
    likedPosts: likedPosts,
  });
}

module.exports = {
  createUser,
  loginUser,
  getUserDetails,
  getUserAssociatedPosts

};
