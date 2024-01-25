const express = require("express");
const router = express.Router();
const { Posts, Likes, Users, Logs } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

async function getPosts(req, res) {
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
}

async function getPostById(req, res) {
  console.log("Inside getPostById function");
  const post = await Posts.findOne({
    where: {
      id: req.params.id,
    },
  });
  res.json(post);
}

async function createPost(req, res) {
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
}

async function updatePostTitle(req, res) {
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
}

async function updatePostText(req, res) {
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
}

async function deletePost(req, res) {
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
}

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePostTitle,
  updatePostText,
  deletePost,
};
