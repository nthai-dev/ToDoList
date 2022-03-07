const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Acess token not found!" });
  }

  try {
    const payload = jwt.verify(token, process.env.ACESS_TOKEN_SECRET);
    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid token!" });
  }
};

module.exports = verifyToken;
