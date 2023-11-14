const express = require("express");
const router = express.Router();
const { Users, Logs } = require("../models");
const { Posts, Likes } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");

const { sign } = require("jsonwebtoken");

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - auth
 *     description: Create a new user with username and password.
 *     parameters:
 *       - name: username
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User created successfully.
 *       400:
 *         description: User already exists.
 */
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({
    where: {
      username: username,
    },
  });

  if (!user) {
    bcrypt.hash(password, 10).then(async (hash) => {
      await Users.create({
        username: username,
        password: hash,
      });
      await Logs.create({
        actionType: "insert",
        modelName: "Users",
        invokerId: null,
        description: `Registered user: "${username}"`
      })
    });
    res.json({ status: "success" });
  } else {
    res.json({ status: "user_already_exists" });
  }
});

/**
 * @swagger
 * auth/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - auth
 *     description: Authenticate a user by username and password.
 *     parameters:
 *       - name: username
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *       400:
 *         description: User does not exist or wrong password.
 */
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

/**
 * @swagger
 * auth/auth:
 *   get:
 *     summary: Get user details
 *     tags:
 *       - auth
 *     description: Retrieve user details if the token is valid.
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *       401:
 *         description: User not logged in or invalid token.
 */

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

/**
 * @swagger
 * auth/user/{id}:
 *   get:
 *     summary: Get user and associated posts
 *     tags:
 *       - auth
 *     description: Retrieve user information and their associated posts.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         format: int64
 *     responses:
 *       200:
 *         description: User and associated posts retrieved successfully.
 *       404:
 *         description: User not found.
 */

router.get("/user/:id", async (req, res) => {
  const id = req.params.id;

  const basicInfo = await Users.findByPk(id);
  const associatedPosts = await Posts.findAll({
    where: {
      username: basicInfo.username,
    },
    include: [Likes],
  });
  res.json({
    id: basicInfo.id,
    username: basicInfo.username,
    associatedPosts: associatedPosts,
  });
});

module.exports = router;
