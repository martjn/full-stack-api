const express = require("express");
const router = express.Router();
const { Posts, Likes, Users, Logs } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

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
router.get("/", validateToken, async (req, res) => {
  const { sortBy } = req.query;
  let order = [];

  if (sortBy === "date") {
    order = [["createdAt", "DESC"]];
  } else if (sortBy === "popularity") {
    order = [[Likes, "createdAt", "DESC"]];
  } else {
    // Default sorting or handle unknown sortBy values
    order = [["createdAt", "ASC"]];
  }
  const listOfPosts = await Posts.findAll({ include: [Likes], order });

  const likedPosts = await Likes.findAll({
    where: {
      UserId: req.user.id,
    },
  });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});
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
router.get("/:id", async (req, res) => {
  const post = await Posts.findOne({
    where: {
      id: req.params.id,
    },
  });
  res.json(post);
});

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
router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  post.username = req.user.username;
  await Posts.create(post);

  const user = await Users.findOne({
    where: {
      username: req.user.username,
    },
  });
  await Logs.create({
    actionType: "insert",
    modelName: "Posts",
    invokerId: user.id,
    description: `created post titled "${req.body.title}"`,
  });
  res.json(post);
});

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
router.put("/title", validateToken, async (req, res) => {
  const { newTitle, id } = req.body;

  const oldVersion = await Posts.findOne({
    where: {
      id: id,
    },
  });

  await Posts.update(
    { title: newTitle },
    {
      where: {
        id: id,
      },
    }
  );
  await Logs.create({
    actionType: "update",
    modelName: "Posts",
    invokerId: req.user.id,
    description: `Post with id ${id}: changed title from "${oldVersion.title}" -> "${newTitle}"`,
  });
  res.json(newTitle);
});

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
router.put("/postText", validateToken, async (req, res) => {
  const { newText, id } = req.body;
  const oldVersion = await Posts.findOne({
    where: {
      id: id,
    },
  });
  await Posts.update(
    { postText: newText },
    {
      where: {
        id: id,
      },
    }
  );
  await Logs.create({
    actionType: "update",
    modelName: "Posts",
    invokerId: req.user.id,
    description: `Post with id ${id}: changed postText from "${oldVersion.postText}" -> "${newText}"`,
  });
  res.json(newText);
});

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
router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  const post = await Posts.findOne({
    where: {
      id: postId,
    },
  });
  await Posts.destroy({
    where: {
      id: postId,
    },
  });
  await Logs.create({
    actionType: "delete",
    modelName: "Posts",
    invokerId: req.user.id,
    description: `Deleted post titled "${post.title}" with id: ${postId}`,
  });
  res.json("Post deleted");
});

module.exports = router;
