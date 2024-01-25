const express = require("express");
const router = express.Router();
const { Comments, Logs } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const commentsController = require("../controllers/commentsController");

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
router.get("/:id", commentsController.getCommentById);

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
router.post("/", validateToken, commentsController.createComment);

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
router.delete("/:commentId", validateToken, commentsController.deleteComment);

module.exports = router;
