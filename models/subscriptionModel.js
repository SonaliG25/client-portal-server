import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the subscription Product Schema (Line Items)
const subscriptProductSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  discount: { type: Number, default: 0, min: 0 }, // Discount on each product
  total: { type: Number, required: true }, // Total price after applying the discount
  discountType: {
    type: String,
    enum: ["Percentage", "Fixed"],
    default: "Fixed",
  },
  currency: {
    type: String,
    required: true,
    default: "USD", // Set default currency, you can change this based on your requirements
  },
});
const paymentDetailsSchema = new Schema({
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  paymentDate: { type: Date, default: Date.now },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "paypal", "bank_transfer"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  stripeSubscriptionId: { type: String },
  stripePaymentIntentId: { type: String },
  stripeCustomerId: { type: String },
  lastPaymentDate: { type: Date },
});

// Define the subscription Schema
const subscriptionSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User schema
      required: true,
    },
    proposalId: {
      type: Schema.Types.ObjectId,
      ref: "Proposal", // Assuming you have a User schema
      required: true,
    },
    products: [subscriptProductSchema], // Array of subscriptioned products

    paymentHistory: [paymentDetailsSchema],

    isActive: {
      type: Boolean,
      required: true,
    },

    subscriptionStatus: {
      type: String,
      enum: ["processing", "completed", "cancelled"],
      default: "processing",
      required: true,
    },
    // shippingCost: {
    //   type: Number,
    //   default: 0,
    //   min: 0,
    // },
    totalAmount: {
      type: Number,
      required: true, // Total amount including shipping and products
      min: 0,
    },
    totalAmountCurrency: {
      type: String,
      required: true,
      default: "USD", // Currency for total amount
    },
    discount: {
      type: Number,
      default: 0, // Any discount applied to the subscription
      min: 0,
    },
    grandTotal: {
      type: Number,
      required: true, // Grand total after discount
      min: 0,
    },
    grandTotalCurrency: {
      type: String,
      required: true,
      default: "USD", // Currency for grand total
    },
    subscriptionDate: {
      type: Date,
      default: Date.now,
    },
    subscriptionDurationInMonths: {
      type: Number,
      required: true,
    },
    // shippingAddress: {
    //   addressLine1: { type: String, required: true },
    //   addressLine2: { type: String },
    //   city: { type: String, required: true },
    //   state: { type: String, required: true },
    //   postalCode: { type: String, required: true },
    //   country: { type: String, required: true },
    // },
    // paymentMethod: {
    //   type: String,
    //   enum: ["credit_card", "paypal", "bank_transfer"], // "cash_on_delivery"],
    //   required: true,
    // },
    // paymentStatus: {
    //   type: String,
    //   enum: ["pending", "completed", "failed", "refunded"],
    //   default: "pending",
    //   required: true,
    // },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Middleware to update timestamps
subscriptionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Subscription", subscriptionSchema);
