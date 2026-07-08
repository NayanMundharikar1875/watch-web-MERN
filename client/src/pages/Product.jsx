import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

export default function Product() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => { api.get(`/products/${slug}`).then((r) => setP(r.data)); }, [slug]);

  if (!p) return <div className="container"><p className="muted">Loading…</p></div>;

  return (
    <div className="container product-detail">
      <div className="product-image"><img src={p.image} alt={p.name} /></div>
      <div className="product-info">
        <span className="eyebrow">{p.brand}</span>
        <h1>{p.name}</h1>
        <p className="price-big">${p.price.toLocaleString()}</p>
        <p className="rating">★ {p.rating} · {p.reviewCount} reviews</p>
        <p className="desc">{p.description}</p>
        <div className="qty-row">
          <label>Qty</label>
          <input type="number" min="1" value={qty} onChange={(e) => setQty(+e.target.value)} />
        </div>
        <button className="btn-primary" onClick={() => { add(p, qty); setAdded(true); setTimeout(() => setAdded(false), 1500); }}>
          {added ? "✓ Added to Cart" : "Add to Cart"}
        </button>
        <p className="stock">In stock: {p.stock}</p>
      </div>
    </div>
  );
}
