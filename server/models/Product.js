const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String, default: "AETHERIUS" },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  category: { type: String, enum: ["men", "women", "kids"], required: true },
  image: { type: String, required: true },
  isTrending: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
