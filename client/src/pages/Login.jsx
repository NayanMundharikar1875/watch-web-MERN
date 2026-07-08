// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page user came from, default to home
  const from = location.state?.from || "/";

  // Agar user already logged in hai to home page pe bhejo
  useEffect(() => {
    if (user) {
      navigate(from);
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await login(email, password);
      // User state update ho jayega and useEffect trigger hoga
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <PageTransition>
    <div className="auth-page">
      <div className="bg-hero"></div>
      <div className="overlay-dark"></div>
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">LUXE&nbsp;HOROLOGY</div>
            <h2>Welcome Back</h2>
            <p>Sign in to continue your luxury journey</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-icon">
                <i className="fa-regular fa-envelope"></i>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <div className="input-icon">
                <i className="fa-regular fa-lock"></i>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
              {!loading && <i className="fa-regular fa-arrow-right"></i>}
            </button>
          </form>
          
          <div className="auth-footer">
            <p className="demo-note">
              <i className="fa-regular fa-info-circle"></i> Demo: Use any email & password
            </p>
            <p className="auth-switch">
              Don't have an account? <Link to="/register" state={{ from: from }}>Create Account</Link>
            </p>
            <Link to="/" className="back-link">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}