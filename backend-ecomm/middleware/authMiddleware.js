// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Adjust path as needed

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("Authentication required");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new Error("User not found");
    }

    // Attach user to request
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = authenticate;