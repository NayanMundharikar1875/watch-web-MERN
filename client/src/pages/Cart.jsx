// src/pages/Cart.jsx
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import PageTransition from "../components/PageTransition";
import axios from "axios";
import "./Cart.css";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  
  // Shipping Address State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  });

  // Card Payment Details
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: ""
  });

  // UPI Payment Details
  const [upiDetails, setUpiDetails] = useState({
    upiId: ""
  });

  // Net Banking Details
  const [netBankingDetails, setNetBankingDetails] = useState({
    bankName: ""
  });

  // If cart is empty
  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="cart-page">
        <div className="bg-hero"></div>
        <div className="overlay-dark"></div>
        <div className="empty-cart-container">
          <div className="empty-cart-card">
            <i className="fa-regular fa-bag-shopping"></i>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any watches to your cart yet.</p>
            <div className="empty-cart-buttons">
              <Link to="/men" className="btn-primary">Shop Men's Watches</Link>
              <Link to="/women" className="btn-outline">Shop Women's Watches</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    if (!shippingAddress.fullName || !shippingAddress.phone || 
        !shippingAddress.addressLine1 || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.pincode) {
      alert("Please fill in all required shipping address fields");
      return false;
    }

    if (!/^[0-9]{10}$/.test(shippingAddress.phone)) {
      alert("Please enter a valid 10-digit phone number");
      return false;
    }

    if (!/^[0-9]{6}$/.test(shippingAddress.pincode)) {
      alert("Please enter a valid 6-digit pincode");
      return false;
    }

    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber || !cardDetails.cardName || 
          !cardDetails.expiryMonth || !cardDetails.expiryYear || !cardDetails.cvv) {
        alert("Please fill in all card details");
        return false;
      }
      
      const cleanCardNumber = cardDetails.cardNumber.replace(/\s/g, '');
      if (!/^[0-9]{16}$/.test(cleanCardNumber)) {
        alert("Please enter a valid 16-digit card number");
        return false;
      }
      
      if (!/^[0-9]{3,4}$/.test(cardDetails.cvv)) {
        alert("Please enter a valid CVV");
        return false;
      }
      
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      const expYear = parseInt(cardDetails.expiryYear);
      const expMonth = parseInt(cardDetails.expiryMonth);
      
      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        alert("Card has expired");
        return false;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiDetails.upiId || !upiDetails.upiId.includes('@')) {
        alert("Please enter a valid UPI ID (example: name@bankname)");
        return false;
      }
    } else if (paymentMethod === 'netbanking') {
      if (!netBankingDetails.bankName) {
        alert("Please select a bank");
        return false;
      }
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      alert("Please login to place order");
      navigate("/login");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    
    try {
      // Log the order data for debugging
      console.log("=== PLACING ORDER ===");
      console.log("User:", user);
      console.log("Cart Items:", cartItems);
      console.log("Cart Total:", cartTotal);
      console.log("Payment Method:", paymentMethod);
      console.log("Shipping Address:", shippingAddress);
      
      const orderData = {
        user: {
          userId: user?._id,
          name: user?.name || shippingAddress.fullName,
          email: user?.email || shippingAddress.email
        },
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          brand: item.brand,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: cartTotal,
        paymentMethod: paymentMethod,
        paymentDetails: paymentMethod === 'card' ? {
          cardNumber: cardDetails.cardNumber.slice(-4),
          cardName: cardDetails.cardName,
          expiryMonth: cardDetails.expiryMonth,
          expiryYear: cardDetails.expiryYear
        } : (paymentMethod === 'upi' ? {
          upiId: upiDetails.upiId
        } : (paymentMethod === 'netbanking' ? {
          bankName: netBankingDetails.bankName
        } : (paymentMethod === 'cod' ? {
          method: "Cash on Delivery"
        } : null))),
        shippingAddress: {
          fullName: shippingAddress.fullName,
          email: shippingAddress.email,
          phone: shippingAddress.phone,
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2 || "",
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          country: shippingAddress.country
        },
        orderStatus: 'pending',
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        createdAt: new Date().toISOString()
      };
      
      console.log("Order Data being sent:", JSON.stringify(orderData, null, 2));
      
      // Check if backend is reachable first
      try {
        const testResponse = await axios.get('http://localhost:5000/api/test');
        console.log("Backend test response:", testResponse.data);
      } catch (testError) {
        console.error("Backend not reachable:", testError.message);
        alert("Cannot connect to server. Please make sure the backend server is running on port 5000.");
        setIsProcessing(false);
        return;
      }
      
      const response = await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });
      
      console.log("Response received:", response.data);
      
      if (response.data.success) {
        setOrderDetails({
          orderId: response.data.order.orderId,
          totalAmount: response.data.order.totalAmount,
          paymentMethod: response.data.order.paymentMethod,
          orderDate: new Date(response.data.order.createdAt).toLocaleString(),
          orderStatus: response.data.order.orderStatus,
          paymentStatus: response.data.order.paymentStatus
        });
        setOrderPlaced(true);
        clearCart();
        console.log("✅ Order placed successfully!");
      } else {
        console.error("Order failed:", response.data.message);
        alert("Failed to place order: " + (response.data.message || "Please try again"));
      }
    } catch (error) {
      console.error("❌ Error placing order:", error);
      
      if (error.code === 'ECONNABORTED') {
        alert("Request timeout. Please check your internet connection and try again.");
      } else if (error.response) {
        console.error("Server error response:", error.response.data);
        alert(error.response.data?.message || "Server error. Please try again.");
      } else if (error.request) {
        console.error("No response from server");
        alert("Cannot connect to server. Please make sure the backend server is running on port 5000.\n\nRun: node server.js in your backend folder");
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Order placed success screen (UPDATED - Removed View Order Details button)
  if (orderPlaced) {
    return (
      <div className="cart-page">
        <div className="bg-hero"></div>
        <div className="overlay-dark"></div>
        <div className="order-success-container">
          <div className="success-card">
            <div className="success-icon">
              <i className="fa-regular fa-circle-check"></i>
            </div>
            <h2>Order Placed Successfully! 🎉</h2>
            <p className="success-message">Thank you for shopping with Luxe Horology</p>
            
            {orderDetails && (
              <div className="order-info">
                <div className="info-row">
                  <span>Order ID:</span>
                  <strong>{orderDetails.orderId}</strong>
                </div>
                <div className="info-row">
                  <span>Total Amount:</span>
                  <strong>₹{orderDetails.totalAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div className="info-row">
                  <span>Payment Method:</span>
                  <strong>{orderDetails.paymentMethod.toUpperCase()}</strong>
                </div>
                <div className="info-row">
                  <span>Payment Status:</span>
                  <strong className={orderDetails.paymentStatus === 'paid' ? 'status-paid' : 'status-pending'}>
                    {orderDetails.paymentStatus.toUpperCase()}
                  </strong>
                </div>
                <div className="info-row">
                  <span>Order Status:</span>
                  <strong>{orderDetails.orderStatus.toUpperCase()}</strong>
                </div>
                <div className="info-row">
                  <span>Order Date:</span>
                  <strong>{orderDetails.orderDate}</strong>
                </div>
              </div>
            )}
            
            <div className="delivery-info">
              <i className="fa-regular fa-truck"></i>
              <p>Estimated Delivery: 3-5 business days</p>
            </div>
            
            <p className="order-note">
              Order confirmation has been sent to your email
            </p>
            
            <div className="success-buttons">
              <Link to="/" className="btn-primary">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Checkout screen (same as before, but with user data pre-filled)
  if (showCheckout) {
    return (
      <div className="cart-page">
        <div className="bg-hero"></div>
        <div className="overlay-dark"></div>
        <div className="checkout-container">
          <div className="checkout-card">
            <h2>Secure Checkout</h2>
            
            <div className="checkout-summary">
              <h3>Order Summary</h3>
              <div className="summary-items">
                <div className="summary-row-cart">
                  <span>Total Items:</span>
                  <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="summary-row-cart">
                  <span>Subtotal:</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-row-cart">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="summary-row-cart total-amount">
                  <span>Total Amount:</span>
                  <strong>₹{cartTotal.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>
            
            <div className="shipping-form">
              <h3>Shipping Address <span className="required">*</span></h3>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={shippingAddress.email}
                  onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number *"
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
              />
              <input
                type="text"
                placeholder="Address Line 1 *"
                value={shippingAddress.addressLine1}
                onChange={(e) => setShippingAddress({...shippingAddress, addressLine1: e.target.value})}
              />
              <input
                type="text"
                placeholder="Address Line 2 (Optional)"
                value={shippingAddress.addressLine2}
                onChange={(e) => setShippingAddress({...shippingAddress, addressLine2: e.target.value})}
              />
              <div className="form-row">
                <input
                  type="text"
                  placeholder="City *"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="State *"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Pincode *"
                  value={shippingAddress.pincode}
                  onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={shippingAddress.country}
                  disabled
                  className="disabled-input"
                />
              </div>
            </div>
            
            <div className="payment-methods">
              <h3>Select Payment Method</h3>
              
              <label className={`payment-option ${paymentMethod === "card" ? "active" : ""}`}>
                <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} 
                  onChange={() => setPaymentMethod("card")} />
                <i className="fa-regular fa-credit-card"></i>
                <span>Credit / Debit Card</span>
                <div className="card-icons">
                  <i className="fa-brands fa-cc-visa"></i>
                  <i className="fa-brands fa-cc-mastercard"></i>
                  <i className="fa-brands fa-cc-amex"></i>
                </div>
              </label>
              
              {paymentMethod === "card" && (
                <div className="payment-details-form card-form">
                  <input
                    type="text"
                    placeholder="Card Number *"
                    value={cardDetails.cardNumber}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\s/g, '');
                      if (value.length > 16) value = value.slice(0, 16);
                      value = value.replace(/(.{4})/g, '$1 ').trim();
                      setCardDetails({...cardDetails, cardNumber: value});
                    }}
                    maxLength="19"
                  />
                  <input
                    type="text"
                    placeholder="Cardholder Name *"
                    value={cardDetails.cardName}
                    onChange={(e) => setCardDetails({...cardDetails, cardName: e.target.value.toUpperCase()})}
                  />
                  <div className="form-row">
                    <select
                      value={cardDetails.expiryMonth}
                      onChange={(e) => setCardDetails({...cardDetails, expiryMonth: e.target.value})}
                    >
                      <option value="">Month</option>
                      {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                        <option key={month} value={month.toString().padStart(2, '0')}>
                          {month.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <select
                      value={cardDetails.expiryYear}
                      onChange={(e) => setCardDetails({...cardDetails, expiryYear: e.target.value})}
                    >
                      <option value="">Year</option>
                      {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                        <option key={year} value={year.toString().slice(-2)}>{year}</option>
                      ))}
                    </select>
                    <input
                      type="password"
                      placeholder="CVV *"
                      value={cardDetails.cvv}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length > 4) value = value.slice(0, 4);
                        setCardDetails({...cardDetails, cvv: value});
                      }}
                      maxLength="4"
                    />
                  </div>
                  <p className="secure-note">
                    <i className="fa-regular fa-lock"></i> Your card details are secure and encrypted
                  </p>
                </div>
              )}
              
              <label className={`payment-option ${paymentMethod === "upi" ? "active" : ""}`}>
                <input type="radio" name="payment" value="upi" checked={paymentMethod === "upi"} 
                  onChange={() => setPaymentMethod("upi")} />
                <i className="fa-brands fa-google-pay"></i>
                <span>UPI / Google Pay</span>
              </label>
              
              {paymentMethod === "upi" && (
                <div className="payment-details-form upi-form">
                  <input
                    type="text"
                    placeholder="UPI ID (example: username@bankname) *"
                    value={upiDetails.upiId}
                    onChange={(e) => setUpiDetails({upiId: e.target.value})}
                  />
                  <p className="upi-note">Support: Google Pay, PhonePe, Paytm, Amazon Pay</p>
                </div>
              )}
              
              <label className={`payment-option ${paymentMethod === "netbanking" ? "active" : ""}`}>
                <input type="radio" name="payment" value="netbanking" checked={paymentMethod === "netbanking"} 
                  onChange={() => setPaymentMethod("netbanking")} />
                <i className="fa-regular fa-building-columns"></i>
                <span>Net Banking</span>
              </label>
              
              {paymentMethod === "netbanking" && (
                <div className="payment-details-form netbanking-form">
                  <select
                    value={netBankingDetails.bankName}
                    onChange={(e) => setNetBankingDetails({bankName: e.target.value})}
                  >
                    <option value="">Select Bank *</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                    <option value="yes">Yes Bank</option>
                    <option value="pnb">Punjab National Bank</option>
                    <option value="bob">Bank of Baroda</option>
                  </select>
                </div>
              )}
              
              <label className={`payment-option ${paymentMethod === "cod" ? "active" : ""}`}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} 
                  onChange={() => setPaymentMethod("cod")} />
                <i className="fa-regular fa-money-bill"></i>
                <span>Cash on Delivery</span>
              </label>
              
              {paymentMethod === "cod" && (
                <div className="payment-details-form cod-form">
                  <p className="cod-note">
                    <i className="fa-regular fa-truck"></i> Pay in cash when your order arrives. 
                    No additional charges for COD.
                  </p>
                </div>
              )}
            </div>
            
            <div className="checkout-actions">
              <button className="btn-outline" onClick={() => setShowCheckout(false)}>
                ← Back to Cart
              </button>
              <button className="btn-primary" onClick={handlePlaceOrder} disabled={isProcessing}>
                {isProcessing ? (
                  <>Processing <i className="fa-regular fa-spinner fa-spin"></i></>
                ) : (
                  <>Place Order • ₹{cartTotal.toLocaleString('en-IN')}</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Cart View
  return (
    <PageTransition>
      <div className="cart-page">
        <div className="bg-hero"></div>
        <div className="overlay-dark"></div>
        
        <div className="cart-container">
          <h1>Shopping Cart</h1>
          <p className="cart-subtitle">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
          
          <div className="cart-content">
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div className="cart-item-row" key={item.id}>
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <h3>{item.brand} {item.name}</h3>
                    <p className="item-price">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="cart-item-quantity">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div className="cart-item-total">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    <i className="fa-regular fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="cart-actions">
                <button className="btn-outline" onClick={clearCart}>Clear Cart</button>
                <button className="btn-primary" onClick={() => setShowCheckout(true)}>
                  Proceed to Checkout →
                </button>
              </div>
              {!isAuthenticated && (
                <p className="login-note">
                  <i className="fa-regular fa-lock"></i> You'll need to login to complete checkout
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}