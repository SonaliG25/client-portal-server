// Route handler to handle single image upload
function uploadSingleImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.status(200).json({ fileUrl: `/uploads/${req.file.filename}` }); // update imageUrl to fileUrl in newProduct.js
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { uploadSingleImage };
