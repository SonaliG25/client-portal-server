
// Route handler to handle single image upload
function uploadSingleImage(req, res) { try {
  if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
  }
  res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
} catch (error) {
  res.status(500).json({ error: error.message });
}
}

export { uploadSingleImage };

