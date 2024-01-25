const express = require("express");
const router = express.Router();
const { Posts, Likes, Users, Logs } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const postsController = require("../controllers/postsController");

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get a list of posts
 *     description: Retrieve a list of posts, including liked posts by the user.
 *     tags:
 *       - posts
 *     responses:
 *       200:
 *         description: List of posts and liked posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 listOfPosts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 likedPosts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Like'
 *       401:
 *         description: Unauthorized. Token missing or invalid.
 */
router.get("/", validateToken, postsController.getPosts);
/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     description: Retrieve a specific post by its ID.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the post.
 *     responses:
 *       200:
 *         description: The requested post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.get("/:id", postsController.getPostById);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post with user authentication.
 *     tags:
 *       - Posts
 *     requestBody:
 *       description: The post to create.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The newly created post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized. Token missing or invalid.
 */
router.post("/", validateToken, postsController.createPost);

/**
 * @swagger
 * /posts/title:
 *   put:
 *     summary: Update a post's title
 *     description: Update a post's title by providing the new title and post ID.
 *     tags:
 *       - Posts
 *     requestBody:
 *       description: New title and post ID.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newTitle:
 *                 type: string
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The updated post's new title.
 *       401:
 *         description: Unauthorized. Token missing or invalid.
 */
router.put("/title", validateToken, postsController.updatePostTitle);

/**
 * @swagger
 * /posts/postText:
 *   put:
 *     summary: Update a post's text
 *     description: Update a post's text by providing the new text and post ID.
 *     tags:
 *       - Posts
 *     requestBody:
 *       description: New text and post ID.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newText:
 *                 type: string
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The updated post's new text.
 *       401:
 *         description: Unauthorized. Token missing or invalid.
 */
router.put("/postText", validateToken, postsController.updatePostText);

/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Delete a post by ID
 *     description: Delete a specific post by its ID.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the post to delete.
 *     responses:
 *       200:
 *         description: Post successfully deleted.
 *       401:
 *         description: Unauthorized. Token missing or invalid.
 */
router.delete("/:postId", validateToken, postsController.deletePost);

module.exports = router;
