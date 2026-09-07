import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Routes
import authRoutes from "./routes/authroutes.js";
import productRoutes from "./routes/productroutes.js";
import orderRoutes from "./routes/orderroutes.js";
import adminRoutes from "./routes/adminroutes.js";
import uploadRoutes from "./routes/uploadroutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// =======================
// MIDDLEWARE
// =======================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// =======================
// UPLOADS
// =======================

const __dirname = path.resolve();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =======================
// ROUTES
// =======================

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// =======================
// TEST ROUTE
// =======================

app.get("/", (req, res) => {
  res.json({
    message: "TechVault360 server is running",
  });
});

// =======================
// MONGODB CONNECTION
// =======================

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined. Check your .env file.");
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("✅ MongoDB connected successfully");

      app.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📱 Network: http://10.21.153.90:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("❌ MongoDB connection failed:", error);
    });
}