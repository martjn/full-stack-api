const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

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
router.post("/", validateToken, async (req, res) => {
  const { PostId } = req.body;
  const UserId = req.user.id;

  const found = await Likes.findOne({
    where: { PostId: PostId, UserId: UserId },
  });

  if (!found) {
    await Likes.create({ PostId: PostId, UserId: UserId });
    await Logs.create({
      actionType: "insert",
      modelName: "Likes",
      invokerId: UserId,
      description: `Post with id ${PostId} liked by User with id ${UserId}`
    })
    res.json({ liked: true });
  } else {
    await Likes.destroy({
      where: {
        PostId: PostId,
        UserId: UserId,
      },
    });
    await Logs.create({
      actionType: "delete",
      modelName: "Likes",
      invokerId: UserId,
      description: `Post with id ${PostId} unliked by User with id ${UserId}`
    })
    res.json({ liked: false });
  }
});

module.exports = router;
