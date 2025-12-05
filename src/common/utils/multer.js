import path from "path";
import multer from "multer";

function fileFilter(req, file, cb) {
  if (
    path.extname(file.originalName) !== ".xlsx" &&
    file.mimetype !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    cb(null, false);
  } else {
    cb(null, true);
  }
}

const uploader = multer({
  fileFilter,
  dest: "/reports",
  limits: { fileSize: 10 * 1024 * 1024 }, //* 10 MB
});

export default uploader;
