// Shared seed data — used by both seed.js (MongoDB) and server.js (in-memory fallback)
module.exports = [
  {
    slug: "aero-date-ii", name: "Aero-Date II", brand: "AETHERIUS",
    price: 4200, stock: 12, rating: 4.8, reviewCount: 124, category: "men",
    isTrending: true, isBestseller: true,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    description: "Aviator-grade titanium with sapphire crystal. Engineered for altitude."
  },
  {
    slug: "lunar-phase", name: "Lunar Phase", brand: "AETHERIUS",
    price: 12500, stock: 4, rating: 4.9, reviewCount: 87, category: "women",
    isTrending: false, isBestseller: true,
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80",
    description: "Mother-of-pearl dial tracking the moon's silent dance."
  },
  {
    slug: "exposed-mk1", name: "Exposed MK1", brand: "AETHERIUS",
    price: 15200, stock: 3, rating: 5.0, reviewCount: 41, category: "men",
    isTrending: true, isBestseller: true,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80",
    description: "Open-heart skeleton movement. Every gear visible, every second luxurious."
  },
  {
    slug: "aurora-pilot", name: "Aurora Pilot", brand: "AETHERIUS",
    price: 3450, stock: 20, rating: 4.6, reviewCount: 203, category: "men",
    isTrending: false, isBestseller: true,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
    description: "Northern-light gradient dial with luminescent indices."
  },
  {
    slug: "triton-diver", name: "Triton Diver", brand: "AETHERIUS",
    price: 6800, stock: 8, rating: 4.7, reviewCount: 156, category: "men",
    isTrending: true, isBestseller: false,
    image: "https://images.unsplash.com/photo-1606859309268-1ec43dbc434f?w=800&q=80",
    description: "Dive-rated to 500m. Crystal-green bezel inspired by deep reefs."
  },
  {
    slug: "frost-monolith", name: "Frost Monolith", brand: "AETHERIUS",
    price: 1850, stock: 30, rating: 4.4, reviewCount: 312, category: "women",
    isTrending: true, isBestseller: false,
    image: "https://images.unsplash.com/photo-1495856458515-0637185db551?w=800&q=80",
    description: "Brushed-silver case. Minimal, monolithic, magnetic."
  },
  {
    slug: "junior-nexus", name: "Junior Nexus", brand: "AETHERIUS",
    price: 890, stock: 45, rating: 4.5, reviewCount: 88, category: "kids",
    isTrending: false, isBestseller: false,
    image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&q=80",
    description: "First-watch for future collectors. Shock-resistant, kid-proof."
  },
  {
    slug: "ether-rose", name: "Ether Rose", brand: "AETHERIUS",
    price: 5400, stock: 10, rating: 4.8, reviewCount: 67, category: "women",
    isTrending: true, isBestseller: false,
    image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80",
    description: "Rose-gold accents on a silver ether dial. Quiet luxury."
  }
];
