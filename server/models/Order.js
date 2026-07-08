// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, sparse: true }, // Changed: not required initially
  user: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, required: true }
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  paymentMethod: { 
    type: String, 
    enum: ["card", "upi", "netbanking", "cod"], 
    required: true 
  },
  paymentDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" }
  },
  orderStatus: { 
    type: String, 
    enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"], 
    default: "pending" 
  },
  paymentStatus: { 
    type: String, 
    enum: ["pending", "paid", "failed", "refunded"], 
    default: "pending" 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Generate unique order ID before saving (FIXED)
orderSchema.pre("save", async function(next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderId = `LH-${timestamp}-${random}`;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Order", orderSchema);