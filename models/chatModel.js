// import mongoose from 'mongoose';

// const messageSchema = new mongoose.Schema({
//     senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     text: { type: String, required: true },
//     timestamp: { type: Date, default: Date.now }
// });

// const chatRoomSchema = new mongoose.Schema({
//     participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//     messages: [messageSchema]
// }, { timestamps: true });

// export default mongoose.model('ChatRoom', chatRoomSchema);

import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);

