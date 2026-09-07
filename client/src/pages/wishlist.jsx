import React, { useState, useEffect } from "react";
import ProductCard from "../components/product/ProductCard"; // Adjust import path if needed

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);

  const loadWishlist = () => {
    try {
      const items = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistItems(items);
    } catch (err) {
      console.error("Failed to load wishlist", err);
      setWishlistItems([]);
    }
  };

  useEffect(() => {
    loadWishlist();

    window.addEventListener("wishlistUpdated", loadWishlist);
    window.addEventListener("storage", loadWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", loadWishlist);
      window.removeEventListener("storage", loadWishlist);
    };
  }, []);

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px", color: "#1f2937" }}>
        My Wishlist ({wishlistItems.length})
      </h2>

      {wishlistItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", background: "#f9fafb", borderRadius: "16px" }}>
          <p style={{ fontSize: "16px", color: "#6b7280" }}>Your wishlist is currently empty.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "25px" }}>
          {wishlistItems.map((product, index) => (
            <ProductCard key={product._id || product.id || index} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}