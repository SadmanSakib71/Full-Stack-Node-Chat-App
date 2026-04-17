const bcrypt = require("bcrypt");
const User = require("../models/people");

//get users page
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.render("users", {
      users: users,
    });
  } catch (error) {
    next(error);
  }
};

//add user
const addUser = async (req, res, next) => {
  try {
    let newUser;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    if (req.files && req.files.length > 0) {
      newUser = new User({
        ...req.body,
        password: hashedPassword,
        avatar: req.files[0].filename,
      });
    } else {
      newUser = new User({
        ...req.body,
        password: hashedPassword,
      });
    }

    const result = await newUser.save();
    res.status(200).json({
      message: "User was added successfully",
    });
  } catch (error) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occurred",
        },
      },
    });
  }
};

module.exports = {
  getUsers,
  addUser,
};
