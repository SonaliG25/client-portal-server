import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the Proposal Template Schema
const proposalTemplateSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  clientNamePlaceholder: { type: String, default: "[Client Name]" },
  budget: { type: Number },
  duration: { type: String },
  status: { type: String, default: "draft" },
  attachments: [{ fileName: String, fileUrl: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update timestamps
proposalTemplateSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("ProposalTemplate", proposalTemplateSchema);
