const express = require("express");
const router = express.Router();
const { Comments, Logs } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const commentsController = require("../controllers/commentsController");

async function getCommentById(req, res) {
  const postId = req.params.id;
  const comments = await Comments.findAll({
    where: {
      PostId: postId,
    },
  });
  res.json(comments);
}

async function createComment(req, res) {
  const comment = req.body;
  const username = req.user.username;
  comment.username = username;
  await Comments.create(comment);
  await Logs.create({
    actionType: "insert",
    modelName: "Comments",
    invokerId: req.user.id,
    description: `User with id ${req.user.id} added a comment to post with id ${req.body.PostId}`,
  });
  res.json(comment);
}

async function deleteComment(req, res) {
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
    description: `User with id ${req.user.id} deleted a comment from post with id ${req.body.PostId}`,
  });

  res.json("DELETED SUCCESSFULLY");
}

module.exports = {
  getCommentById,
  createComment,
  deleteComment,
};
