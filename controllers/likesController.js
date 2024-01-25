const express = require("express");
const router = express.Router();
const { Likes, Logs } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

async function likePost(req, res) {
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
      description: `Post with id ${PostId} liked by User with id ${UserId}`,
    });
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
      description: `Post with id ${PostId} unliked by User with id ${UserId}`,
    });
    res.json({ liked: false });
  }
}

module.exports = {
  likePost,
};
