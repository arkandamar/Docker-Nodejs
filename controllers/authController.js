const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashPassword,
    });

    // set session
    req.session.user = newUser;

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // check user
    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    // check password
    const isCorrect = bcrypt.compare(password, user.password);

    if (isCorrect) {
      // set session
      req.session.user = user;
      
      res.status(200).json({
        status: "success",
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "incorrect user",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "fail",
    });
  }
};
