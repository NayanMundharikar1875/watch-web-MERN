// routes/orders.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// GET all orders (with optional filters)
router.get("/", async (req, res) => {
  try {
    const { userId, orderId } = req.query;
    let query = {};
    
    if (userId) query["user.userId"] = userId;
    if (orderId) query.orderId = orderId;
    
    const orders = await Order.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
});

// GET single order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message
    });
  }
});

// CREATE new order (FIXED - with better error handling)
router.post("/", async (req, res) => {
  console.log("📦 Received order request");
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  
  try {
    const {
      user,
      items,
      totalAmount,
      paymentMethod,
      paymentDetails,
      shippingAddress,
      orderStatus,
      paymentStatus,
      createdAt
    } = req.body;
    
    // Validate required fields
    if (!user || !user.userId) {
      console.log("❌ Missing user information");
      return res.status(400).json({
        success: false,
        message: "User information is required. Please login again."
      });
    }
    
    if (!items || items.length === 0) {
      console.log("❌ No items in order");
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item"
      });
    }
    
    if (!totalAmount || totalAmount <= 0) {
      console.log("❌ Invalid total amount:", totalAmount);
      return res.status(400).json({
        success: false,
        message: "Valid total amount is required"
      });
    }
    
    if (!paymentMethod) {
      console.log("❌ Missing payment method");
      return res.status(400).json({
        success: false,
        message: "Payment method is required"
      });
    }
    
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone ||
        !shippingAddress.addressLine1 || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.pincode) {
      console.log("❌ Invalid shipping address");
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required"
      });
    }
    
    // Create new order (without orderId - it will be auto-generated)
    const newOrder = new Order({
      user: {
        userId: user.userId,
        name: user.name || shippingAddress.fullName,
        email: user.email || shippingAddress.email
      },
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        brand: item.brand,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      paymentDetails: paymentDetails || null,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        email: shippingAddress.email || "",
        phone: shippingAddress.phone,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2 || "",
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: shippingAddress.country || "India"
      },
      orderStatus: orderStatus || "pending",
      paymentStatus: paymentStatus || (paymentMethod === "cod" ? "pending" : "paid"),
      createdAt: createdAt || new Date()
    });
    
    const savedOrder = await newOrder.save();
    console.log("✅ Order saved successfully!");
    console.log("Order ID:", savedOrder.orderId);
    console.log("MongoDB ID:", savedOrder._id);
    
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: {
        id: savedOrder._id,
        orderId: savedOrder.orderId,
        totalAmount: savedOrder.totalAmount,
        paymentMethod: savedOrder.paymentMethod,
        orderStatus: savedOrder.orderStatus,
        paymentStatus: savedOrder.paymentStatus,
        createdAt: savedOrder.createdAt
      }
    });
    
  } catch (error) {
    console.error("❌ Error creating order:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to place order: " + error.message,
      error: error.message
    });
  }
});

// GET user's all orders
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ "user.userId": req.params.userId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: orders.length,
      orders
    });
    
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
      error: error.message
    });
  }
});


// UPDATE ORDER
router.put("/:id", async (req,res)=>{
 try{
 const order=await Order.findByIdAndUpdate(req.params.id,{
 orderStatus:req.body.orderStatus,
 paymentStatus:req.body.paymentStatus
 },{new:true});
 res.json({success:true,order});
 }catch(err){
 res.status(500).json({success:false,message:err.message});
 }
});

module.exports = router;