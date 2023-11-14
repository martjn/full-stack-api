const express = require("express");
const router = express.Router();
const { Comments, Logs } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get comments for a specific post by ID.
 *     tags:
 *       - comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post to retrieve comments for.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comments retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Post not found.
 */
router.get("/:id", async (req, res) => {
  const postId = req.params.id;
  const comments = await Comments.findAll({
    where: {
      PostId: postId,
    },
  });
  res.json(comments);
});

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment.
 *     tags:
 *       - comments
 *     requestBody:
 *       description: Comment object to be created.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Comment created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized, token validation failed.
 */
router.post("/", validateToken, async (req, res) => {
  const comment = req.body;
  const username = req.user.username;
  comment.username = username;
  await Comments.create(comment);
  await Logs.create({
    actionType: "insert",
    modelName: "Comments",
    invokerId: req.user.id,
    description: `User with id ${req.user.id} added a comment to post with id ${req.body.PostId}`
  })
  res.json(comment);
});

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: Delete a comment by ID.
 *     tags:
 *       - comments
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The ID of the comment to be deleted.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment deleted successfully.
 *       401:
 *         description: Unauthorized, token validation failed.
 *       404:
 *         description: Comment not found.
 */
router.delete("/:commentId", validateToken, async (req, res) => {
  const commentId = req.params.commentId;

  await Comments.destroy({
    where: {
      id: commentId,
    },
  });

  await Logs.create({
    actionType: "delete",
    modelName: "Comments",
    invokerId: req.user.id,
    description: `User with id ${req.user.id} deleted a comment from post with id ${req.body.PostId}`
  })

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
