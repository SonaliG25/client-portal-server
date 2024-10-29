import mongoose from "mongoose";
import { addressSchema } from "../models/addressModel.js";
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
// // Define the UserType Enum
// const UserTypeEnum = Object.freeze({
//   LEAD: "lead",
//   PROSPECT: "prospect",
//   OPPORTUNITY: "opportunity",
//   CUSTOMER: "customer",
//   // FORMER_CUSTOMER: "former_customer",
//   // REFERRAL: "referral",
//   // SUSPECT: "suspect",
//   // CONTACT: "contact",
//   // INFLUENCER: "influencer",
//   // STAKEHOLDER: "stakeholder",
// });

// User Schema
const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    userType: {
      type: String,
      enum: ["lead", "prospect", "opportunity", "customer"],
      default: "lead",
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      // unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["client", "admin", "manager", "developer"],
      default: "client",
    },
    ///add usertype : prospect,users
    addresses: { type: [addressSchema], default: [] },
    purchaseHistory: { type: [productSchema], default: [] },
    subscription: { type: [subscriptionSchema], default: [] },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Middleware to update timestamps
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("User", userSchema);
