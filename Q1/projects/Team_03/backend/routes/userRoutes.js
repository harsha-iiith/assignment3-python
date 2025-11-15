const express = require('express');
const router = express.Router()
const {registerUser,loginUser} = require('../controllers/userController');
const verifyUser = require("../middleware/authMiddleware");
const Users = require("../models/userModel");

router.post('/register' , registerUser);
router.post('/login', loginUser);

router.get("/profile", verifyUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;