// controllers/mediaController.js
import path from 'path';
import fs from 'fs';

export const getMediaFile = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../uploads', filename);

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).send('File not found');
    }
    res.sendFile(filePath);
  });
};
