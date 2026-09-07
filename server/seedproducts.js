import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.js";

dotenv.config();

const products = [
  {
    name: "Wireless Headphones",
    description: "High quality wireless headphones with clear sound.",
    price: 1999,
    image: "https://via.placeholder.com/300",
    category: "Electronics",
    stock: 20,
  },
  {
    name: "Smart Watch",
    description: "Modern smartwatch with fitness tracking features.",
    price: 2499,
    image: "https://via.placeholder.com/300",
    category: "Electronics",
    stock: 15,
  },
  {
    name: "Running Shoes",
    description: "Comfortable lightweight shoes for everyday running.",
    price: 1799,
    image: "https://via.placeholder.com/300",
    category: "Fashion",
    stock: 25,
  },
  {
    name: "Backpack",
    description: "Durable backpack suitable for college and travel.",
    price: 999,
    image: "https://via.placeholder.com/300",
    category: "Accessories",
    stock: 30,
  },
  {
    name: "Cotton T-Shirt",
    description: "Comfortable cotton t-shirt for everyday wear.",
    price: 599,
    image: "https://via.placeholder.com/300",
    category: "Fashion",
    stock: 40,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("Products added successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

seedProducts(); 