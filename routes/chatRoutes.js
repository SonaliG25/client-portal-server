import express from "express";
import {createChat,getAdminConversations,getAllChats } from "../controllers/chatController.js";
import { isValidUser } from "../middlewares/userValidatorMiddleware.js";

const router = express.Router();

// Send message (admin to user or user to admin)
router.post("/send", isValidUser, createChat);

// Get all conversations (admin view)
router.get("/chat/:userId", isValidUser, getAllChats);

// Get conversation with a specific user (admin view)
router.get("/chat/admin/:adminId/conversations",isValidUser, getAdminConversations)

export default router;
