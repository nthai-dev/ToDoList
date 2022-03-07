const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const User = require("../model/user");

// @route POST api/auth/register
// @desc Register User
// @access public
router.post("/register", async (req, res) => {
  const { userName, password } = req.body;
  //simple validate
  if (!userName || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing userName or Password!" });
  }

  try {
    //check existing user
    const user = await User.findOne({ userName });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "UserName already taken!" });
    }

    //all good will save new user
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({ userName, password: hashedPassword });
    await newUser.save();

    //return token
    const acessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACESS_TOKEN_SECRET
    );

    return res.json({
      success: true,
      message: "User created successfully",
      token: acessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal server" });
  }
});

// @route POST api/auth/login
// @desc Login
// @access public
router.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  //simple validate
  if (!userName || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing userName or Password!" });
  }

  try {
    //check existing user
    const user = await User.findOne({ userName });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "UserName or Password incorrect!" });
    }

    if (!(await argon2.verify(user.password, password))) {
      return res
        .status(400)
        .json({ success: false, message: "UserName or Password incorrect!" });
    }
    //return token
    const acessToken = jwt.sign(
      { userId: user._id },
      process.env.ACESS_TOKEN_SECRET
    );

    return res.json({
      success: true,
      message: "User login successfully",
      token: acessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal server" });
  }
});
module.exports = router;
