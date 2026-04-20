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
    registered: req.query.registered === "1",
  });
}

// get register page
function getRegister(req, res, next) {
  res.render("register", {
    data: {
      name: "",
      email: "",
      mobile: "",
    },
  });
}

// create account (same logic as usersController.addUser)
const registerUser = async (req, res, next) => {
  try {
    let newUser;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    if (req.files && req.files.length > 0) {
      newUser = new User({
        ...req.body,
        password: hashedPassword,
        avatar: req.files[0].filename,
        role: "user",
      });
    } else {
      newUser = new User({
        ...req.body,
        password: hashedPassword,
        role: "user",
      });
    }

    await newUser.save();
    res.redirect("/?registered=1");
  } catch (error) {
    res.render("register", {
      data: {
        name: req.body.name || "",
        email: req.body.email || "",
        mobile: req.body.mobile || "",
      },
      errors: {
        common: {
          msg: "Unknown error occurred",
        },
      },
    });
  }
};

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
          userid: user._id.toString(),
          username: user.name,
          mobile: user.mobile,
          email: user.email,
          avatar: user.avatar || null,
          role: user.role || "user",
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
        res.redirect("inbox");
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
      registered: false,
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
  getRegister,
  registerUser,
  login,
  logOut,
};
