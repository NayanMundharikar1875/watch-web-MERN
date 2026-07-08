import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const links = [
    { to: "/", label: "Home" },
    { to: "/men", label: "Men" },
    { to: "/women", label: "Women" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <motion.nav
      className="navbar"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="logo">
        <Link to="/">
          <motion.h1 whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
            LUXE&nbsp;HOROLOGY
          </motion.h1>
        </Link>
      </div>

      <div className="nav-links">
        {links.map((link, i) => (
          <motion.div
            key={link.to}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
          >
            <Link to={link.to} className={isActive(link.to) ? "active" : ""}>
              {link.label}
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="nav-auth">
        <Link to="/cart" className="cart-button-link">
          <motion.button
            className="cart-button"
            title="Shopping Cart"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
          >
            🛒 Cart
            {cartCount > 0 && (
              <motion.span
                className="cart-count-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>
        </Link>

        {isAuthenticated ? (
          <>
            <span className="user-name">👋 {user?.name || user?.email?.split("@")[0]}</span>
            <motion.button onClick={logout} className="logout-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Logout
            </motion.button>
          </>
        ) : (
          <>
            <motion.div whileHover={{ scale: 1.05 }}><Link to="/login" className="login-btn">Login</Link></motion.div>
            <motion.div whileHover={{ scale: 1.05 }}><Link to="/register" className="register-btn">Register</Link></motion.div>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
