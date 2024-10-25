
// Route handler to handle single image upload
function uploadSingleImage(req, res) {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  } else {
    console.log("File found:", req.file);
  }

  // File path is already set by multer with disk storage
  const imagePath = req.file.path;

  // Send the path of the uploaded image in the response
  return res.status(200).json({ imageUrl: imagePath });
}

export { uploadSingleImage };

