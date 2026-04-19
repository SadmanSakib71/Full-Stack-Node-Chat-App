const uploader = require("../../utilities/singleUploader");

function avatarUpload(req, res, next) {
  const upload = uploader(
    "avatars",
    ["image/jpeg", "image/jpg", "image/png"],
    1000000,
    "Only .jpg, jpeg or .png format allowed!",
  );
  //call the multer middleware
  upload.any()(req, res, (err) => {
    if (err) {
      if (res.locals.html) {
        res.render("register", {
          data: {
            name: req.body?.name || "",
            email: req.body?.email || "",
            mobile: req.body?.mobile || "",
          },
          errors: {
            avatar: {
              msg: err.message,
            },
          },
        });
      } else {
        res.status(500).json({
          errors: {
            avatar: {
              msg: err.message,
            },
          },
        });
      }
    } else {
      next();
    }
  });
}

module.exports = avatarUpload;
