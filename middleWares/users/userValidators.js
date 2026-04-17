// external imports
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const { unlink } = require("fs");

// internal imports
const User = require("../../models/people");

//validate users field
const addUserValidator = [
  //name validator
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain anything other than alphabet")
    .trim(),

  //email validator
  check("email")
    .isEmail()
    .withMessage("Invalid Email Address")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw createError("Email is already used!");
        }
      } catch (error) {
        throw createError(error.message);
      }
    }),

  //mobile validator
  check("mobile")
    .isMobilePhone("bn-BD", {
      strictMode: true,
    })
    .withMessage("Mobile number must be a valid Bangladeshi mobile number")
    .custom(async (value) => {
      try {
        const user = await User.findOne({ mobile: value });
        if (user) {
          throw createError("Mobile is already use!");
        }
      } catch (error) {
        throw createError(error.message);
      }
    }),

  //password validator
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol",
    ),
];

//validation handler
const addUserValidationHandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    //remove the upload files
    if (req.files.length > 0) {
      const fileName = req.files[0];
      unlink(
        path.join(__dirname, `/public/uploads/avatars/${filename}`),
        (err) => {
          if (err) console.log(err);
        },
      );
    }

    // response the errors
    res.status(500).json({
      errors: mappedErrors,
    });
  }
};

module.exports = { addUserValidator, addUserValidationHandler };
