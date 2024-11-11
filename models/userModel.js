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
    name: { type: String, required: true },
    phone: { type: String, required: true },
    userType: {
      type: String,
      enum: ["lead", "prospect", "opportunity", "customer"],
      default: "lead",
    },
    // account_owner , authforbilling :
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Email for login
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
      enum: ["client", "admin", "manager", "developer"],
      default: "client",
    },

    // Business Details Map
    businessDetails: {
      clientName: { type: String, required: true },
      companyType: { type: String, required: true },
      taxId: { type: String, required: true },
      employeeSize: { type: String, required: true },
      ownerPhone: { type: String, required: true },
      ownerEmail: { type: String, required: true },
    },

    timeZone: { type: String, required: true },

    preferredContactMethod: {
      type: String,
      enum: ["email", "phone", "both"],
      required: true,
    },

    notes: {
      type: [
        {
          content: { type: String, required: true }, // The note content (string)
          noteMadeBy: { type: String, required: true }, // Who made the note (can be user ID, username, or email)
          createdAt: { type: Date, default: Date.now }, // Timestamp when the note was created
        },
      ],
      default: [],
    },
    // Payment Status (Dropdown for selecting Regular or Overdue)
    paymentStatus: {
      type: String,
      enum: ["regular", "overdue", "noPaymentYet"],
      default: "noPaymentYet",
    },
    // Additional fields as per the new requirements
    allowLogin: { type: Boolean, default: false },
    activeAccount: { type: Boolean, default: true },
    bannedAccount: { type: Boolean, default: false },
    // New accountManagers field
    accountManagers: [
      {
        type: Schema.Types.ObjectId,
        ref: "AccountManager", // Referencing the AccountManager model
      },
    ],

    address: {
      street1: { type: String, required: true },
      street2: { type: String, required: true },
      zipCode: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
    },

    purchaseHistory: { type: [productSchema], default: [] },
    subscription: { type: [subscriptionSchema], default: [] },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);
// Define the updated User Schema with businessDetails and other fields in maps
// const userSchema = new Schema(
//   {
//     // Business Details Map
//     businessDetails: {
//       // Client's name (text input)
//       clientName: { type: String, required: true },

//       // Company Type (Open text field)
//       companyType: { type: String, required: true },

//       // Tax ID / VAT Number (Required for invoicing and compliance)
//       taxId: { type: String, required: true },

//       // Employee Size (Open text field)
//       employeeSize: { type: String, required: true },

//       // Business Owner details separated as ownerEmail and ownerPhone
//       ownerPhone: { type: String, required: true },
//       ownerEmail: { type: String, required: true },
//     },

//     // Address Map
//     address: {
//       street1: { type: String, required: true },
//       street2: { type: String, required: true },
//       city: { type: String, required: true },
//       state: { type: String, required: true },
//       country: { type: String, required: true },
//     },

//     // Contact Information Map
//     contact: {
//       phone: { type: String, required: true },
//       email: { type: String, required: true, unique: true, trim: true },
//       timeZone: { type: String, required: true },
//       preferredContactMethod: {
//         type: String,
//         enum: ["email", "phone", "both"],
//         required: true,
//       },
//     },

//     // Account Owner Map

//     accountOwners: [
//       {
//         Name: { type: String, required: true },
//         Phone: { type: String, required: true },
//         Phone2: { type: String, required: true },
//         Email: { type: String, required: true },
//         password: { type: String, required: true },
//         role: {
//           type: String,
//           enum: ["client", "admin", "manager", "developer"],
//           default: "client",
//         },
//         createdBy: {
//           Email: { type: String, required: true },
//         },
//       },
//     ],

//     // Notes (Free-form text field)
//     notes: { type: String, required: false },

//     // Additional fields as per the new requirements
//     allowLogin: { type: Boolean, default: true },
//     activeAccount: { type: Boolean, default: true },
//     bannedAccount: { type: Boolean, default: false },

//     // You can add other existing fields like addresses, purchaseHistory, etc.
//   },
//   {
//     timestamps: true, // Automatically creates createdAt and updatedAt fields
//   }
// );

// Middleware to update timestamps
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("User", userSchema);
