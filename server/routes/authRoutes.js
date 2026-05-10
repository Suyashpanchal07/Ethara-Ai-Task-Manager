const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================
// SIGNUP
// ======================================

router.post("/signup", async (req, res) => {

  try {

    const {

      name,
      email,
      password,
      role,

    } = req.body;


    // CHECK USER

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {

      return res.status(400).json({
        message: "User already exists",
      });
    }


    // HASH PASSWORD

    const salt = await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(password, salt);


    // CREATE USER

    const user = await User.create({

      name,
      email,
      password: hashedPassword,

      // DEFAULT ROLE
      role: role || "member",

    });


    res.status(201).json({
      message: "Signup successful",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});


// ======================================
// LOGIN
// ======================================

router.post("/login", async (req, res) => {

  try {

    const {

      email,
      password,

    } = req.body;


    // FIND USER

    const user = await User.findOne({
      email,
    });

    if (!user) {

      return res.status(400).json({
        message: "Invalid credentials",
      });
    }


    // CHECK PASSWORD

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        message: "Invalid credentials",
      });
    }


    // TOKEN

    const token = jwt.sign(

      {
        id: user._id,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    );


    res.json({

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});


// ======================================
// CURRENT USER
// ======================================

router.get(
  "/me",
  protect,
  async (req, res) => {

    try {

      const user = await User.findById(
        req.user.id
      ).select("-password");


      res.json(user);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;