// src/pages/Register.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./auth.css";

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  
  const from = location.state?.from || "/";

  // Redirect if user becomes available (after registration)
  useEffect(() => {
    if (user) {
      navigate(from);
    }
  }, [user, navigate, from]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    
    try {
      await register(form.name, form.email, form.password);
      // User state will be updated in AuthContext
      // The useEffect above will handle navigation
    } catch (ex) {
      setErr(ex.message || "Registration failed. Please try again.");
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
            <h2>Join the Legacy</h2>
            <p>Create an account to begin your horological journey</p>
          </div>
          
          <form onSubmit={submit} className="auth-form">
            {err && <div className="error-message">{err}</div>}
            
            <div className="input-group">
              <label>Full Name</label>
              <div className="input-icon">
                <i className="fa-regular fa-user"></i>
                <input 
                  type="text" 
                  placeholder="Enter your full name" 
                  required 
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>
            
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-icon">
                <i className="fa-regular fa-envelope"></i>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  required 
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <div className="input-icon">
                <i className="fa-regular fa-lock"></i>
                <input 
                  type="password" 
                  placeholder="Create a password (min 6 characters)" 
                  minLength="6" 
                  required 
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>
            
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <i className="fa-regular fa-arrow-right"></i>}
            </button>
          </form>
          
          <div className="auth-footer">
            <p className="auth-switch">
              Already have an account? <Link to="/login" state={{ from: from }}>Sign In</Link>
            </p>
            <Link to="/" className="back-link">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}