const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

router.get("/", authenticateToken, (req, res) => {
  res.json({ message: "Protected data accessed successfully", user: req.user });
});

module.exports = router;
