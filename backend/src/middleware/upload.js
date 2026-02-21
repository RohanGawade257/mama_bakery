import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (_req, file, callback) => {
  if (!file.mimetype.startsWith("image/")) {
    const error = new Error("Only image uploads are allowed.");
    error.statusCode = 400;
    callback(error);
    return;
  }
  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 4 * 1024 * 1024
  }
});

export default upload;
