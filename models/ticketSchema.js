const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId, // Refers to the client who logged the ticket
      ref: "Client",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId, // Refers to the agent or user responsible for the ticket
      ref: "User",
    },
    resolutionNotes: {
      type: String, // Any notes or updates for the resolution
      trim: true,
    },
    attachments: [
      {
        type: String, // Can store URLs of uploaded files or paths
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId, // User who added the comment (admin/agent/client)
          ref: "User",
        },
        message: {
          type: String,
          required: true,
          trim: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Ticket", ticketSchema);
