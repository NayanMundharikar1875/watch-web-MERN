import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import PageTransition from "../components/PageTransition";
import "./About.css";

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

const About = () => {
  return (
    <PageTransition>
      <div className="about-page">
        <div className="bg-hero"></div>
        <div className="overlay-dark"></div>

        <div className="container">
          <FadeUp>
            <section className="about-hero">
              <div className="hero-badge">✦ OUR STORY ✦</div>
              <h1>About LUXE HOROLOGY</h1>
              <p>Crafting timeless elegance since 1968</p>
            </section>
          </FadeUp>

          <div className="about-content">
            <FadeUp delay={0.1}>
              <div className="about-section">
                <h2>The Art of Horology</h2>
                <p>For over five decades, LUXE HOROLOGY has stood as a beacon of Swiss watchmaking excellence. Our journey began in the heart of Geneva, where master watchmakers dedicated their lives to perfecting the craft of timekeeping.</p>
                <p>Today, we continue that legacy, blending traditional techniques with innovative design to create timepieces that transcend generations.</p>
              </div>
            </FadeUp>

            <div className="about-mission">
              {[
                { icon: "fa-regular fa-gem", title: "Our Mission", text: "To create exceptional timepieces that blend heritage craftsmanship with contemporary design." },
                { icon: "fa-regular fa-eye", title: "Our Vision", text: "To be the world's most revered luxury watch brand, known for uncompromising quality and innovation." },
              ].map((item, i) => (
                <FadeUp key={item.title} delay={i * 0.15}>
                  <motion.div
                    className="mission-card"
                    whileHover={{ y: -6, boxShadow: "0 12px 40px rgba(212,175,122,0.12)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <i className={item.icon}></i>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </motion.div>
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={0.1}>
              <div className="about-section">
                <h2>Swiss Precision</h2>
                <p>Every LUXE HOROLOGY timepiece is powered by Swiss-made movements, ensuring accuracy within milliseconds. Our watches undergo rigorous testing and quality control before they reach your wrist.</p>
              </div>
            </FadeUp>

            <div className="values-grid">
              {[
                { icon: "fa-regular fa-clock", title: "Heritage", text: "Decades of watchmaking expertise passed through generations" },
                { icon: "fa-regular fa-gem", title: "Quality", text: "Only the finest Swiss-grade materials and movements" },
                { icon: "fa-regular fa-star", title: "Innovation", text: "Pushing boundaries while respecting tradition" },
                { icon: "fa-regular fa-handshake", title: "Trust", text: "Building lasting relationships with our collectors" },
              ].map((v, i) => (
                <FadeUp key={v.title} delay={i * 0.1}>
                  <motion.div
                    className="value-card"
                    whileHover={{ y: -5, borderColor: "rgba(212,175,122,0.5)" }}
                    transition={{ duration: 0.25 }}
                  >
                    <i className={v.icon}></i>
                    <h3>{v.title}</h3>
                    <p>{v.text}</p>
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </div>

          <footer>
            <div className="footer-content">
              <div className="footer-col">
                <h4>LUXE HOROLOGY</h4>
                <p>Haute Horlogerie Maison</p>
                <p>47 Rue du Rhône, Geneva</p>
              </div>
              <div className="footer-col">
                <h4>Discover</h4>
                <Link to="/men">Men's Watches</Link>
                <Link to="/women">Women's Watches</Link>
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact</Link>
              </div>
              <div className="footer-col">
                <h4>Connect</h4>
                <div className="social-icons">
                  <i className="fab fa-instagram"></i>
                  <i className="fab fa-twitter"></i>
                  <i className="fab fa-facebook-f"></i>
                  <i className="fab fa-youtube"></i>
                </div>
              </div>
            </div>
            <div className="copyright">© 2025 LUXE HOROLOGY — where time becomes art.</div>
          </footer>
        </div>
      </div>
    </PageTransition>
  );
};

export default About;
