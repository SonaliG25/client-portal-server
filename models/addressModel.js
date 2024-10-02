const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  addressType: {
    type: String,
    enum: ["shipping", "billing"],
    default: "shipping",
  },
});

module.exports = mongoose.model("Address", addressSchema);
