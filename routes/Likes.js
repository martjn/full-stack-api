const express = require("express");
const router = express.Router();
const { Likes, Logs } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const likesController = require("../controllers/likesController")

/**
 * @swagger
 * /likes:
 *   post:
 *     summary: Like or unlike a post
 *     tags:
 *       - likes
 *     description: Like or unlike a post by providing the `PostId` in the request body.
 *     parameters:
 *       - name: PostId
 *         in: formData
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Post liked/unliked successfully.
 *       400:
 *         description: Post not found or user not authenticated.
 */
router.post("/", validateToken, likesController.likePost);

module.exports = router;
