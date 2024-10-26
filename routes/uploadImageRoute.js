import multer from "multer";
import express from "express";
import {uploadSingleImage} from "../controllers/uploadImageController.js";
import { isAdmin } from "../middlewares/userValidatorMiddleware.js";
 const uploadImageRouter = express.Router();
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
  storage: storage
});

// Route to handle single image upload
uploadImageRouter.post(
  "/productImage",
  isAdmin, //  only admins can upload
  upload.single("image"), // Handle single file upload with the field name "image"
  uploadSingleImage // Controller function to process the uploaded image
);

export default uploadImageRouter;