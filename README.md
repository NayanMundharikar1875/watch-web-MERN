# AETHERIUS — Luxury Watch Store

## 🚀 How to Run

### Step 1 — Backend (Terminal 1)
```bash
cd server
npm install
node server.js
```
✅ Server starts on http://localhost:5000  
✅ MongoDB connects automatically  
✅ Products auto-seeded if DB is empty  

### Step 2 — Frontend (Terminal 2)
```bash
cd client
npm install
npm run dev
```
✅ Frontend starts on http://localhost:5173

---

## ⚙️ MongoDB Setup

### Option A — Local MongoDB
Make sure MongoDB is installed and running:
```bash
# Windows: Start MongoDB service from Services
# Or run: mongod
```
`.env` file already set to: `MONGO_URI=mongodb://localhost:27017/luxe_horology`

### Option B — MongoDB Atlas (Cloud)
1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Get connection string
4. Update `server/.env`:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/luxe_horology
```

---

## 🌱 Manual Seed (if needed)
```bash
cd server
node seed.js
```
