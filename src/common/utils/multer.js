import path from "path";
import multer from "multer";
import env from "../../config/env-config.js";

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();

  const allowedMime =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  if (ext !== ".xlsx" || file.mimetype !== allowedMime) {
    return cb(new Error("Only .xlsx files are allowed"));
  }

  return cb(null, true);
}

// Use memory storage so the file is available as `req.file.buffer`.
const storage = multer.memoryStorage();

const uploader = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.MULTER_MAX_FILE_SIZE },
});

export default uploader;
