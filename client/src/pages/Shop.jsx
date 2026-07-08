import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (q) params.set("q", q);
    api.get(`/products?${params}`).then((r) => setProducts(r.data));
  }, [category, q]);

  return (
    <div className="container">
      <header className="page-header">
        <span className="eyebrow">The Atelier</span>
        <h1>All Timepieces</h1>
      </header>
      <div className="filters">
        <div className="chips">
          {["", "men", "women", "kids"].map((c) => (
            <button key={c || "all"} onClick={() => setCategory(c)}
              className={`chip ${category === c ? "active" : ""}`}>
              {c || "All"}
            </button>
          ))}
        </div>
        <input className="search" placeholder="Search timepieces…"
          value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="grid">
        {products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
      {products.length === 0 && <p className="muted center">No timepieces match.</p>}
    </div>
  );
}
