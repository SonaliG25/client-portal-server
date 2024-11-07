import multer from "multer";
import express from "express";
import { uploadSingleImage } from "../controllers/uploadImageController.js";
import { isAdmin } from "../middlewares/userValidatorMiddleware.js";
const uploadRouter = express.Router();
// Multer configuration for storing files on disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Destination directory where the uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // File naming convention (timestamp + original filename)
  },
});

// Configure multer with the storage settings
const upload = multer({
  storage: storage,
});

// Route to handle single image upload
uploadRouter.post(
  "/productImage",
  isAdmin, //  only admins can upload
  upload.single("image"), // Handle single file upload with the field name "image"
  uploadSingleImage // Controller function to process the uploaded image
);
// Route to handle single image upload
uploadRouter.post(
  "/doc",
  isAdmin, //  only admins can upload
  upload.single("doc"), // Handle single file upload with the field name "image"
  uploadSingleImage // Controller function to process the uploaded image
);

// Endpoint for file uploads
uploadRouter.post("/docs", upload.array("docs", 10), (req, res) => {
  if (!req.files) {
    return res.status(400).send("No files uploaded");
  }

  const files = req.files.map((file) => ({
    filename: file.filename,
    url: `/uploads/${file.filename}`,
  }));

  res.status(200).json({ files });
});

export default uploadRouter;
