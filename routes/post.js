const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const Post = require("../model/post");

// @route GET api/posts
// @desc get user's posts
// @access private
router.get("/", verifyToken, async (req, res) => {
  const posts = await Post.find({ createdBy: req.userId });
  return res.json({
    success: true,
    message: "Created Post successfully",
    posts: posts,
  });
});

// @route POST api/posts
// @desc Create new post
// @access private
router.post("/", verifyToken, async (req, res) => {
  const { title, desc, url, status } = req.body;

  //simple validation
  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: "Missing Post title!" });
  }

  const newPost = new Post({
    title,
    desc,
    url,
    status: status || "TO DO",
    createdBy: req.userId,
  });
  try {
    await newPost.save();
    return res.json({
      success: true,
      message: "Created Post successfully",
      post: newPost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal server" });
  }
});
module.exports = router;
