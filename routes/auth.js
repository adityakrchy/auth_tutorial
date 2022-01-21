const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

// Route 1: create new user at /api/createuser
router.post("/createuser", async (req, res) => {
  try {
    console.log(req.body);
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(req.body.password, salt);
    password = hash;
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: password,
    });
    user
      .save()
      .then(() => {
        res.json({ message: "User created successfully" });
      })
      .catch((err) => {
        res.json({ message: "Error: " + err });
      });
    console.log(password);
  } catch (err) {
    res.json({ message: err });
  }
});

// Route 2: Login user at /api/login
router.post("/login", async (req, res) => {
  try {
    console.log("login endpoint triggered");
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.json({ message: "User does not exist" });
      return;
    }
    const passwordIsValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      res.json({ message: "Invalid password" });
    } else {
      const data = {
        id: user._id,
      };
      const token = await jwt.sign(data, process.env.SECRET);
      res.json(token);
    }
  } catch (error) {
    res.json({ message: error });
  }
});

// Route 3: Get user info at /api/user
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    console.log(req.user);
    userId = req.user;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
