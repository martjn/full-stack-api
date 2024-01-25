const express = require("express");
const router = express.Router();
const { Users, Logs } = require("../models");
const { Posts, Likes } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");

const { sign } = require("jsonwebtoken");

const usersController = require("../controllers/usersController");

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
router.post("/", usersController.createUser);

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
router.post("/login", usersController.loginUser);

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

router.get("/auth", validateToken, usersController.getUserDetails);

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

router.get("/user/:id", usersController.getUserAssociatedPosts);

module.exports = router;
