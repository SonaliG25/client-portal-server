import Chat from "../models/chatModel.js";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in an "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  },
});
const upload = multer({ storage });

// Get chat history between two users
export const getChat = async (req, res) => {
  const { userId, receiverId } = req.params;
  try {
    const messages = await Chat.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Send a new message with optional attachment
export const sendMessage = async (req, res) => {
  const { sender, receiver, message } = req.body;
  let fileData = null;

  if (req.file) {
    fileData = {
      url: `/uploads/${req.file.filename}`,
      type: req.file.mimetype.split("/")[0], // "image", "video", or "document"
    };
  }

  try {
    const newMessage = await Chat.create({ sender, receiver, message, file: fileData });
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const uploadMiddleware = upload.single("file"); // Middleware for handling single file uploads
