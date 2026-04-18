const User = require("../models/people");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

//get login page
function getLogIN(req, res, next) {
  res.render("login", {
    data: {
      username: "",
    },
  });
}

//do login
const login = async (req, res, next) => {
  try {
    // find a user who has this email/username
    const user = await User.findOne({
      $or: [{ email: req.body.username }, { mobile: req.body.username }],
    });

    if (user && user._id) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password,
      );
      if (isValidPassword) {
        // prepare the user object to generate token
        const userObject = {
          username: user.name,
          mobile: user.mobile,
          email: user.email,
          role: "user",
        };

        //generate token
        const token = jwt.sign(userObject, process.env.JWT_secret, {
          expiresIn: process.env.JWT_EXPIRY,
        });

        // set cookie
        // res.cookie(process.env.COOKIE_NAME, token, {
        //   maxAge: process.env.JWT_EXPIRY,
        //   httpOnly: true,
        //   signed: true,
        // });
        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: process.env.JWT_EXPIRY,
          httpOnly: true,
          signed: true,
          secure: process.env.NODE_ENV === "production",
        });

        // set logged in user local identifier
        res.locals.loggedInUser = userObject;
        res.render("inbox");
      } else {
        throw createError("Login failed! Please try again.");
      }
    } else {
      throw createError("Login failed! Please try again.");
    }
  } catch (error) {
    res.render("login", {
      data: {
        username: req.body.username,
      },
      errors: {
        common: {
          msg: error.message,
        },
      },
    });
  }
};

//do logout
const logOut = async (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("Logged Out");
};

module.exports = {
  getLogIN,
  login,
  logOut,
};
