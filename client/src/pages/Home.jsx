import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useInView, useAnimation } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";
import PageTransition from "../components/PageTransition";
import "./Home.css";

gsap.registerPlugin(ScrollTrigger);

const USD_TO_INR = 95;

const watches = [
  {
    id: 1,
    name: "AETHER Chronograph",
    description: "Flyback chronograph, 18k rose gold case, alligator strap.",
    price: Math.round(8950 * USD_TO_INR),
    oldPrice: Math.round(10950 * USD_TO_INR),
    icon: "fa-regular fa-clock",
    badge: "Limited",
  },
  {
    id: 2,
    name: "OCEANUS Deep",
    description: "Titanium diver's watch, 300m water resistance, ceramic bezel.",
    price: Math.round(4750 * USD_TO_INR),
    oldPrice: null,
    icon: "fa-regular fa-gem",
  },
  {
    id: 3,
    name: "Céleste Moonphase",
    description: "Moonphase complication, mother-of-pearl dial, diamond indices.",
    price: Math.round(12200 * USD_TO_INR),
    oldPrice: Math.round(14900 * USD_TO_INR),
    icon: "fa-regular fa-star",
  },
  {
    id: 4,
    name: "Monaco Skeleton",
    description: "Skeleton dial, manual winding movement, sapphire exhibition caseback.",
    price: Math.round(6880 * USD_TO_INR),
    oldPrice: null,
    icon: "fa-regular fa-eye",
  },
];

// Animated counter hook
function useCounter(end, duration = 2) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return { count, ref };
}

const StatItem = ({ num, suffix, label }) => {
  const { count, ref } = useCounter(num, 2);
  return (
    <div className="stat-item" ref={ref}>
      <div className="stat-number">{count}{suffix}</div>
      <div>{label}</div>
    </div>
  );
};

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

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const heroTextRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroBadgeRef = useRef(null);
  const heroBtnRef = useRef(null);

  // GSAP hero entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(heroBadgeRef.current, { opacity: 0, y: 20, duration: 0.6 })
        .from(heroTextRef.current, { opacity: 0, y: 50, duration: 0.9 }, "-=0.3")
        .from(heroSubRef.current, { opacity: 0, y: 30, duration: 0.7 }, "-=0.5")
        .from(heroBtnRef.current, { opacity: 0, y: 20, duration: 0.6 }, "-=0.4");
    });
    return () => ctx.revert();
  }, []);

  // GSAP ScrollTrigger for section title
  const sectionTitleRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sectionTitleRef.current, {
        scrollTrigger: {
          trigger: sectionTitleRef.current,
          start: "top 85%",
        },
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: "power3.out",
      });
    });
    return () => ctx.revert();
  }, []);

  const handleSubscribe = () => {
    if (email && email.includes("@") && email.includes(".")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <PageTransition>
      <div className="home-container">
        <div className="bg-hero"></div>
        <div className="overlay-dark"></div>

        <div className="container">
          {/* Hero */}
          <section className="hero">
            <div ref={heroBadgeRef} className="hero-badge">✦ TIMELESS HERITAGE ✦</div>
            <h2 ref={heroTextRef}>Sculpted by time,<br />defined by <span>elegance</span></h2>
            <p ref={heroSubRef}>Swiss precision meets modern craftsmanship. Discover iconic timepieces that transcend generations.</p>
            <div ref={heroBtnRef} className="btn-group">
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(212,175,122,0.35)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/men")}
              >
                EXPLORE COLLECTION →
              </motion.button>
              <motion.button
                className="btn-outline"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/women")}
              >
                VIRTUAL BOUTIQUE
              </motion.button>
            </div>
          </section>

          {/* Watch Grid */}
          <div ref={sectionTitleRef}>
            <div className="section-title">Iconic Timepieces</div>
            <div className="section-sub">Crafted for visionaries &amp; connoisseurs</div>
          </div>

          <div className="watch-grid">
            {watches.map((watch, i) => (
              <FadeUp key={watch.id} delay={i * 0.1}>
                <Tilt
                  tiltMaxAngleX={8}
                  tiltMaxAngleY={8}
                  glareEnable={true}
                  glareMaxOpacity={0.12}
                  glareColor="#d4af7a"
                  glarePosition="all"
                  style={{ height: "100%" }}
                >
                  <motion.div
                    className="watch-card"
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="watch-img">
                      <i className={`${watch.icon} fa-4x`} style={{ color: "#d4af7a" }}></i>
                    </div>
                    {watch.badge && (
                      <div style={{ background: "#d4af7a20", width: "fit-content", margin: "0 auto 8px", padding: "2px 12px", borderRadius: "30px", fontSize: "0.7rem", color: "#d4af7a" }}>
                        {watch.badge}
                      </div>
                    )}
                    <h3>{watch.name}</h3>
                    <div className="watch-desc">{watch.description}</div>
                    <div className="price">
                      ₹{watch.price.toLocaleString("en-IN")}
                      {watch.oldPrice && (
                      <span className="old-price">
                      {watch.oldPrice.toLocaleString("en-IN")}
                    </span>
                       )}
                    </div>
                    <motion.button
                      className="card-btn"
                      whileHover={{ scale: 1.03, backgroundColor: "#d4af7a", color: "#0a0c10" }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => navigate("/men")}
                    >
                      Quick View <i className="fa-regular fa-arrow-right"></i>
                    </motion.button>
                  </motion.div>
                </Tilt>
              </FadeUp>
            ))}
          </div>

          {/* Story Section */}
          <FadeUp>
            <div className="story-section">
              <div className="story-text">
                <h3>Beyond The Dial</h3>
                <p>Since 1968, Luxe Horology has redefined precision watchmaking. Our atelier in Geneva merges heritage with avant-garde design.</p>
                <p>We believe a watch is not merely an instrument to tell time — it's a companion for life's milestones.</p>
                <div className="signature">— Alexandre V., Chief Artisan</div>
              </div>
              <div className="story-stats">
                <StatItem num={120} suffix="+" label="Awards & Accolades" />
                <StatItem num={38} suffix="K+" label="Happy Collectors" />
                <StatItem num={5} suffix=" YRS" label="International Warranty" />
              </div>
            </div>
          </FadeUp>

          {/* Newsletter */}
          <FadeUp delay={0.1}>
            <div className="newsletter">
              <h3>Join The Inner Circle</h3>
              <p>Receive early access to limited editions, private sale events &amp; horological insights.</p>
              {subscribed ? (
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ color: "#d4af7a", fontSize: "1.1rem", marginTop: "16px" }}
                >
                  ✦ Welcome to the inner circle.
                </motion.p>
              ) : (
                <div className="news-form">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleSubscribe}
                  >
                    Subscribe →
                  </motion.button>
                </div>
              )}
              <p style={{ fontSize: "0.75rem", marginTop: "20px" }}>No spam, only timeless stories.</p>
            </div>
          </FadeUp>

          {/* Footer */}
          <footer>
            <div className="footer-content">
              <div className="footer-col">
                <h4>LUXE HOROLOGY</h4>
                <p>Haute Horlogerie Maison</p>
                <p>Ahmedabad, India</p>
                <p>+91 7878484757</p>
              </div>
              <div className="footer-col">
                <h4>Discover</h4>
                <Link to="/men">Men's Watches</Link>
                <Link to="/women">Women's Watches</Link>
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact</Link>
              </div>
              <div className="footer-col">
                <h4>Client Care</h4>
                <Link to="#">Shipping &amp; Returns</Link>
                <Link to="#">Care Guide</Link>
                <Link to="#">Certificate of Authenticity</Link>
              </div>
              <div className="footer-col">
                <h4>Connect</h4>
                <div className="social-icons">
                  {["fa-instagram", "fa-twitter", "fa-facebook-f", "fa-youtube"].map((icon) => (
                    <motion.i
                      key={icon}
                      className={`fab ${icon}`}
                      whileHover={{ scale: 1.3, color: "#d4af7a" }}
                      style={{ cursor: "pointer" }}
                    ></motion.i>
                  ))}
                </div>
                <p style={{ marginTop: "18px" }}>press@luxehorology.com</p>
              </div>
            </div>
            <div className="copyright">© 2025 LUXE HOROLOGY — where time becomes art. All rights reserved.</div>
          </footer>
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;
