const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Inline seed data as fallback (when MongoDB not connected)
const seedData = require("../seedData");

// GET /api/products?category=men&q=rolex
router.get("/", async (req, res) => {
  try {
    // If MongoDB is connected, use it
    if (mongoose.connection.readyState === 1) {
      const Product = require("../models/Product");
      const { category, q } = req.query;
      const filter = {};
      if (category) filter.category = category;
      if (q) filter.name = { $regex: q, $options: "i" };
      const products = await Product.find(filter).sort({ createdAt: -1 });
      return res.json(products);
    }

    // Fallback: use seedData in memory
    let products = seedData;
    if (req.query.category) {
      products = products.filter(p => p.category === req.query.category);
    }
    if (req.query.q) {
      const q = req.query.q.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const Product = require("../models/Product");
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ success: false, message: "Not found" });
      return res.json(product);
    }
    const product = seedData.find(p => p.slug === req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
