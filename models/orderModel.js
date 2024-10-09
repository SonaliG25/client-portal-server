import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the Order Product Schema (Line Items)
const orderProductSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  sku: { type: String, required: true }, // SKU for quick reference
  name: { type: String, required: true },
  salePrice: { type: Number, required: true }, // The price at which the product was sold
  quantity: { type: Number, required: true, min: 1 },
  total: { type: Number, required: true }, // Total = salePrice * quantity
  purchaseType: {
    type: String,
    enum: ["one-time", "subscription"], // Assuming "one-time" and "subscription" types
    default: "one-time",
    required: true,
  },
});

// Define the Order Schema
const orderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User schema
      required: true,
    },
    products: [orderProductSchema], // Array of ordered products
    shippingAddress: {
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "bank_transfer", "cash_on_delivery"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["processing", "delivered", "cancelled"],
      default: "processing",
      required: true,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true, // Total amount including shipping and products
      min: 0,
    },
    discount: {
      type: Number,
      default: 0, // Any discount applied to the order
      min: 0,
    },
    grandTotal: {
      type: Number,
      required: true, // Grand total after discount
      min: 0,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Middleware to update timestamps
orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Order", orderSchema);
