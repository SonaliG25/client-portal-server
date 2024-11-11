import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: false }, // message text is optional if there's an attachment
    room: { type: String, required: true },
    file: {
      url: { type: String, required: false }, // File URL for attachments
      type: { type: String, enum: ["image", "video", "document"], required: false }, // Define allowed file types
    },
    // New fields to track read/unread status
    readBy: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"  // Reference to User who read the message
      }
    ],
    isRead: {
      type: Boolean,
      default: false,  // Optionally use this to track the overall read status of the message
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);
