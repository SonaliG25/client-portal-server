// controllers/chatController.js
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

// Send a new chat message
export const createChat = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    // Find sender and receiver to validate their roles
    const senderUser = await User.findById(sender);
    const receiverUser = await User.findById(receiver);

    if (!senderUser || !receiverUser) {
      return res.status(404).json({ message: "Sender or receiver not found" });
    }

    // Allow only client-to-admin or manager chats, similar to customer support
    if (
      (senderUser.role === "client" && ["admin", "manager"].includes(receiverUser.role)) ||
      (receiverUser.role === "client" && ["admin", "manager"].includes(senderUser.role))
    ) {
      const chat = await Chat.create({ sender, receiver, message });
      return res.status(201).json(chat);
    } else {
      return res.status(403).json({ message: "Unauthorized chat request" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all chat conversations for a user
export const getAllChats = async (req, res) => {
  try {
    const userId = req.params.userId;
    const chats = await Chat.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "username role")
      .populate("receiver", "username role")
      .sort({ createdAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminConversations = async (req, res) => {
    try {
      const adminId = req.params.adminId;
  
      // Check if the user is an admin
      const adminUser = await User.findById(adminId);
      if (!adminUser || adminUser.role !== "admin") {
        return res.status(403).json({ message: "Only admins can access this resource." });
      }
  
      // Fetch all unique client conversations for this admin
      const chats = await Chat.find({
        $or: [{ sender: adminId }, { receiver: adminId }],
      })
        .populate("sender", "username role")
        .populate("receiver", "username role")
        .sort({ createdAt: 1 });
  
      // Filter and organize the chats by unique client conversations
      const clientConversations = {};
      chats.forEach((chat) => {
        const client = chat.sender.role === "client" ? chat.sender : chat.receiver;
        const clientId = client._id.toString();
        if (!clientConversations[clientId]) {
          clientConversations[clientId] = { client, messages: [] };
        }
        clientConversations[clientId].messages.push(chat);
      });
  
      res.status(200).json(Object.values(clientConversations));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
