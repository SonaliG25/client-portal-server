import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the Address Schema
export const addressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false }, // To mark the default address
});

export default mongoose.model("Address", addressSchema);
