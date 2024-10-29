import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the Proposal Template Schema
const proposalTemplateSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: "draft" },
},
{
  timestamps: true, // Automatically creates createdAt and updatedAt fields
}
);

// Middleware to update timestamps
proposalTemplateSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("ProposalTemplate", proposalTemplateSchema);
