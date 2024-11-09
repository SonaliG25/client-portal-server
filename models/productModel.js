import mongoose from "mongoose";
const { Schema } = mongoose;

// Define constants for purchase types
const purchaseTypes = ["one-time", "subscription"];

// Product Schema
const productSchema = new Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
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
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    totalCost: {
      type: Number,
      required: true,
      min: 0,
    },
    productManager: {
      type: mongoose.Schema.Types.ObjectId, // Assuming managers are stored as User documents
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Retired"],
      default: "Active",
    },
    activeSubscriptions: {
      type: Number,
      // required: true,
      // min: 0,
      default:0
    },
    revenueGenerated: {
      type: Number,
      // required: true,
      // min: 0,
      default:0
    },
    // stock: {
    //   type: Number,
    //   required: false,
    //   min: 0,
    // },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    purchaseType: {
      type: String,
      enum: ["one-time", "subscription"],
      required: true,
      default: "one-time", // Default value for purchase type
    },
    duration: {
      type: Number,
      required: function () {
        return this.purchaseType === "subscription"; // Only required if purchaseType is "subscription"
      },
      min: 1,
      max: 365, // Maximum duration, e.g., 1 year (can adjust as per your needs)
      default: 12, // Default duration is 12 months for subscriptions
    },
    currency: {
      type: String,
      required: true,
      default: "USD", // Set default currency, you can change this based on your requirements
    },
    // isAvailable: {
    //   type: Boolean,
    //   required: true,
    // },
    tags: {
      type: [String],
      index: true, // Useful for filtering and search
    },
    keywords: {
      type: [String], // Array of keywords for search
    },

    // views: {
    //   type: Number,
    //   default: 0, // Tracks product views
    // },
    // salesCount: {
    //   type: Number,
    //   default: 0, // Tracks product sales
    // },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Middleware to update the updatedAt field on findOneAndUpdate
productSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Indexes for search optimization
productSchema.index({ name: "text", description: "text", keywords: "text" }); // Text index for full-text search
productSchema.index({ price: 1 }); // Range query index on price
productSchema.index({ category: 1, brand: 1 }); // Compound index for category and brand filtering
// Index views and salesCount for sorting queries
productSchema.index({ views: 1 });
productSchema.index({ salesCount: 1 });

// Export the Product model
export default mongoose.model("Product", productSchema);
