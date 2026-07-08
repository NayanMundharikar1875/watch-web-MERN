import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import axios from "axios";
import PageTransition from "../components/PageTransition";
import "./Contact.css";

const FadeUp = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/contacts/submit", formData);
      if (response.data.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        setError(response.data.message || "Failed to send message");
      }
    } catch (err) {
      setError("Cannot connect to server. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="contact-page">
        <div className="bg-hero"></div>
        <div className="overlay-dark"></div>

        <div className="container">
          <FadeUp>
            <section className="contact-hero">
              <div className="hero-badge">✦ GET IN TOUCH ✦</div>
              <h1>Contact Us</h1>
              <p>We'd love to hear from you</p>
            </section>
          </FadeUp>

          <div className="contact-wrapper">
            <FadeUp delay={0.1}>
              <div className="contact-info">
                <h2>Visit Our Boutique</h2>
                {[
                  { icon: "fa-solid fa-location-dot", title: "Address", lines: ["Ahmedabad, India"] },
                  { icon: "fa-solid fa-phone", title: "Phone", lines: ["+91 7878484757"] },
                  { icon: "fa-solid fa-envelope", title: "Email", lines: ["info@luxehorology.com", "press@luxehorology.com"] },
                  { icon: "fa-solid fa-clock", title: "Opening Hours", lines: ["Mon–Fri: 10:00 AM – 7:00 PM", "Saturday: 11:00 AM – 6:00 PM", "Sunday: Closed"] },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    className="info-item"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <i className={item.icon}></i>
                    <div>
                      <h4>{item.title}</h4>
                      {item.lines.map((l) => <p key={l}>{l}</p>)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="contact-form-wrapper">
                <h2>Send Us a Message</h2>
                {error && (
                  <motion.div className="error-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <i className="fa-solid fa-circle-exclamation"></i> {error}
                  </motion.div>
                )}
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      className="success-message"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                    >
                      <i className="fa-regular fa-circle-check"></i>
                      <h3>Message Sent!</h3>
                      <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={handleSubmit} className="contact-form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {["name", "email", "subject"].map((field, i) => (
                        <motion.div
                          key={field}
                          className="form-group"
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                        >
                          <input
                            type={field === "email" ? "email" : "text"}
                            name={field}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            value={formData[field]}
                            onChange={handleChange}
                            required
                          />
                        </motion.div>
                      ))}
                      <motion.div className="form-group" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
                        <textarea name="message" placeholder="Your Message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
                      </motion.div>
                      <motion.button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                        whileHover={{ scale: 1.03, boxShadow: "0 0 24px rgba(212,175,122,0.3)" }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {loading ? "Sending..." : <>Send Message <i className="fa-regular fa-arrow-right"></i></>}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </FadeUp>
          </div>

          <footer>
            <div className="footer-content">
              <div className="footer-col"><h4>LUXE HOROLOGY</h4><p>Haute Horlogerie Maison</p><p>47 Rue du Rhône, Geneva</p></div>
              <div className="footer-col"><h4>Quick Links</h4><Link to="/men">Men's Watches</Link><Link to="/women">Women's Watches</Link><Link to="/about">About Us</Link></div>
              <div className="footer-col"><h4>Connect</h4><div className="social-icons"><i className="fab fa-instagram"></i><i className="fab fa-twitter"></i><i className="fab fa-facebook-f"></i><i className="fab fa-youtube"></i></div></div>
            </div>
            <div className="copyright">© 2025 LUXE HOROLOGY — where time becomes art.</div>
          </footer>
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;
