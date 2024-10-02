import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the Product Schema (for purchase history)
const productSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  name: String,
  price: Number,
  purchaseDate: { type: Date, default: Date.now },
});

// Define the Subscription Schema
const subscriptionSchema = new Schema({
  planId: { type: Schema.Types.ObjectId, ref: "Subscription" },
  planName: String,
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  status: {
    type: String,
    enum: ["active", "inactive", "cancelled"],
    default: "active",
  },
});

// User Schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["client", "admin"],
    default: "client",
  },
  purchaseHistory: [productSchema],
  subscription: [subscriptionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update timestamps
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("User", userSchema);
