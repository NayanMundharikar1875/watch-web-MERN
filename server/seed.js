require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const seedData = require("./seedData");

(async () => {
  if (!process.env.MONGO_URI) { console.error("MONGO_URI missing in .env"); process.exit(1); }
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany({});
  await Product.insertMany(seedData);
  console.log(`✅ Seeded ${seedData.length} products`);
  process.exit(0);
})();
