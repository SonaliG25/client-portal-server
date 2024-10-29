import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the Product Line Schema (for products in the proposal)
const selectedProductSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  discount: { type: Number, default: 0, min: 0 }, // Discount on each product
  total: { type: Number, required: true }, // Total price after applying the discount
  discountType: {
    type: String,
    enum: ["percentage", "fixed"],
    default: "fixed",
  },
  currency: {
    type: String,
    required: true,
    default: "USD", // Set default currency, you can change this based on your requirements
  },
});

// Proposal Schema
const proposalSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    emailTo: { //Proposed To
      type: String,
      required: true,
      trim: true,
    },
    title: { //
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String, // The template text or structure for the proposal
      required: true,
    },
    products: [selectedProductSchema], // Array of selected products
    productTotal: {
      type: Number,
      required: true,
      default: 0, // Sum of individual product totals
    },
    grandTotal: {
      type: Number,
      required: true,
      default: 0, // Grand total after discounts
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "fixed",
    },
    discountOnGrandTotal: {
      type: Number,
      default: 0, // Discount applied to the grand total
      min: 0,
    },
    grandTotalCurrency: {
      type: String,
      required: true,
      default: "USD", // Set default currency for grand total
    },
    finalAmount: {
      type: Number,
      required: true,
      default: 0, // Final amount after applying all discounts
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);
//Table Structure (Proposed To, Title, SentOn{CreatedOn} | View |Edit |)
// Middleware to update timestamps
proposalSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Proposal", proposalSchema);
