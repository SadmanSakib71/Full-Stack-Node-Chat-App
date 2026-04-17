const multer = require("multer");
const fs = require("node:fs");
const path = require("node:path");
const createError = require("http-errors");

function uploader(
  subfolder_path,
  allowed_file_types,
  max_file_size,
  error_msg,
) {
  // One level up from utilities/ → project root (../../ would escape the project)
  const upload_folder = path.join(__dirname, "../public/uploads", subfolder_path);

  //define the storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      fs.mkdirSync(upload_folder, { recursive: true });
      cb(null, upload_folder);
    },

    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();

      cb(null, fileName + fileExt);
    },
  });

  //prepare the final multer upload object

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: max_file_size,
    },
    fileFilter: (req, file, cb) => {
      if (allowed_file_types.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createError(error_msg));
      }
    },
  });

  return upload;
}

module.exports = uploader;
