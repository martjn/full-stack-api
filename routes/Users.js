const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const { Posts, Likes } = require("../models");
const bcrypt = require("bcrypt");
const {validateToken} = require("../middlewares/AuthMiddleware")

const { sign } = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({
    where: {
      username: username,
    },
  });

  if (!user) {
    bcrypt.hash(password, 10).then((hash) => {
      Users.create({
        username: username,
        password: hash,
      });
    });
    res.json({ status: "success" });
  } else {
    res.json({ status: "user_already_exists" });
  }
});

router.post("/login", async (req, res) => {
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
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
})

router.get("/user/:id", async (req, res) => {
  const id = req.params.id

  const basicInfo = await Users.findByPk(id);
  const associatedPosts = await Posts.findAll({where: {
    username: basicInfo.username,
  }, include: [Likes]})
  res.json({id: basicInfo.id, username: basicInfo.username, associatedPosts: associatedPosts})
})

module.exports = router;
