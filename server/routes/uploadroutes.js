import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

// Define disk storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File filter for images only
function checkFileTypes(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Images only! (jpg, jpeg, png, webp)"));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileTypes(file, cb);
  },
});

// POST /api/upload
router.post("/", upload.single("image"), (req, res) => {
  res.send({
    message: "Image uploaded successfully",
    image: `/${req.file.path.replace(/\\/g, "/")}`,
  });
});

export default router;