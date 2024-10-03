import mongoose from "mongoose";
const { Schema } = mongoose;

// Define constants for purchase types
const purchaseTypes = ["one-time", "subscription"];

// Product Schema
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  purchaseType: {
    type: String,
    enum: purchaseTypes,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update timestamps
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Export the Product model
export default mongoose.model("Product", productSchema);
