const orderSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      quantity: { type: Number, default: 1 },
      price: Number,
    },
  ],
  totalAmount: { type: Number, required: true },

  // Address captured at checkout
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  orderStatus: {
    type: String,
    enum: ["processing", "shipped", "delivered"],
    default: "processing",
  },

  orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
