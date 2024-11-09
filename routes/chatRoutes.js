import express from "express";
import { isValidUser } from "../middlewares/userValidatorMiddleware.js";
import { getChat, sendMessage,uploadMiddleware } from "../controllers/chatController.js";

const router = express.Router();

router.get("/:userId/:receiverId",isValidUser, getChat); // Fetch chat history
router.post("/send", isValidUser,uploadMiddleware, sendMessage); // Send message with optional file upload

export default router;
