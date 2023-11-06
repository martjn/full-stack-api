const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [Likes] });

  const likedPosts = await Likes.findAll({
    where: {
      UserId: req.user.id,
    },
  });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});
router.get("/:id", async (req, res) => {
  const post = await Posts.findOne({
    where: {
      id: req.params.id,
    },
  });
  res.json(post);
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  post.username = req.user.username;
  await Posts.create(post);
  res.json(post);
});

/*
router.put("/:id", validateToken, async (req, res) => {
  try{
    const post = await Posts.findOne({
      where: {
        id: req.params.id,
      }
    })

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if(post.username === req.body.username){

      post.set({
        title: req.body.title,
        postText: req.body.postText,
        username: req.body.username
      })
    
      await post.save();
    
      res.json(req.body);
    }
    else{
      res.json({error: "unauthorized"})
    }
  
  }
  catch(error){
    console.error(error);
    res.status(500).json({error: error})
  }


})
*/

router.put("/title", validateToken, async (req, res) => {
  const { newTitle, id } = req.body;
  await Posts.update(
    { title: newTitle },
    {
      where: {
        id: id,
      },
    }
  );
  res.json(newTitle);
});
router.put("/postText", validateToken, async (req, res) => {
  const { newText, id } = req.body;
  await Posts.update(
    { postText: newText },
    {
      where: {
        id: id,
      },
    }
  );
  res.json(newText);
});

router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  await Posts.destroy({
    where: {
      id: postId,
    },
  });
  res.json("Post deleted");
});

module.exports = router;
