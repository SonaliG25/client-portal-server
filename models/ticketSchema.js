import mongoose from "mongoose";

const { Schema } = mongoose;
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
    client: {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
      },
    },
    assignedTo: {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
        // required: true,
        trim: true,
      },
      email: {
        type: String,
        // required: true,
        trim: true,
      },
    },
    resolutionNotes: {
      type: String, // Any notes or updates for the resolution
      trim: true,
      default: "",
    },
    attachments: [
      {
        filename: {
          type: String,
          required: true,
        },
        path: {
          type: String,
          required: true,
        },
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

export default mongoose.model("Ticket", ticketSchema);
