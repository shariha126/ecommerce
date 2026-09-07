import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cartcontext";

function ProductCard({ product }) {
  if (!product) return null;

  const navigate = useNavigate();
  const { addToCart } = useCart();

  const productId = product._id || product.id || product.name;

  // =========================
  // WISHLIST
  // =========================
  const [isWishlisted, setIsWishlisted] = useState(() => {
    try {
      const wishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );

      return wishlist.some(
        (item) =>
          (item._id || item.id || item.name) === productId
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      const wishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );

      const exists = wishlist.some(
        (item) =>
          (item._id || item.id || item.name) === productId
      );

      setIsWishlisted(exists);
    } catch (err) {
      console.error(err);
    }
  }, [productId]);

  // =========================
  // WISHLIST TOGGLE
  // =========================
  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      let wishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );

      const existingIndex = wishlist.findIndex(
        (item) =>
          (item._id || item.id || item.name) === productId
      );

      let newState;

      if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        newState = false;
      } else {
        wishlist.push(product);
        newState = true;
      }

      localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
      );

      setIsWishlisted(newState);

      window.dispatchEvent(
        new Event("wishlistUpdated")
      );
    } catch (err) {
      console.error(
        "Failed to update wishlist:",
        err
      );
    }
  };

  // =========================
  // OPEN PRODUCT DETAILS
  // =========================
  const openProduct = () => {
    if (!productId) {
      console.error("Product ID missing:", product);
      return;
    }

    navigate(`/product/${productId}`);
  };

  // =========================
  // ADD TO CART
  // =========================
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      addToCart(product);
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  const image =
    product.image ||
    "https://via.placeholder.com/300x220?text=No+Image";

  return (
    <div style={styles.card}>

      {/* =========================
          IMAGE
      ========================= */}
      <div
        style={styles.imageContainer}
        onClick={openProduct}
      >

        <span style={styles.badge}>
          {product.category || "ELECTRONICS"}
        </span>

        {/* HEART */}
        <div
          onClick={toggleWishlist}
          style={styles.wishlistButton}
          role="button"
          tabIndex={0}
        >
          <Heart
            size={20}
            color={
              isWishlisted
                ? "#ef4444"
                : "#ffffff"
            }
            fill={
              isWishlisted
                ? "#ef4444"
                : "rgba(0,0,0,0.4)"
            }
          />
        </div>

        <img
          src={image}
          alt={product.name || "Product"}
          style={styles.image}
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/300x220?text=No+Image";
          }}
        />
      </div>

      {/* =========================
          PRODUCT DETAILS
      ========================= */}
      <div style={styles.content}>

        <p style={styles.subCategory}>
          {product.category?.toUpperCase() ||
            "ELECTRONICS"}
        </p>

        {/* CLICK NAME → DETAILS */}
        <h3
          style={styles.name}
          onClick={openProduct}
        >
          {product.name || "Unnamed Product"}
        </h3>

        <p style={styles.description}>
          {product.description ||
            "No description available"}
        </p>

        <div style={styles.bottom}>

          <span style={styles.price}>
            ₹
            {Number(
              product.price || 0
            ).toLocaleString("en-IN")}
          </span>

        </div>

        {/* =========================
            ADD TO CART
        ========================= */}
        <button
          onClick={handleAddToCart}
          disabled={
            product.stock !== undefined &&
            product.stock <= 0
          }
          style={{
            ...styles.cartButton,
            opacity:
              product.stock !== undefined &&
              product.stock <= 0
                ? 0.5
                : 1,
          }}
        >
          🛒 Add to Cart
        </button>

        {/* =========================
            VIEW DETAILS
        ========================= */}
        <button
          onClick={openProduct}
          style={styles.detailsButton}
        >
          View Details →
        </button>

      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#1e1b4b",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
  },

  imageContainer: {
    width: "100%",
    height: "220px",
    background: "#facc15",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  badge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    background: "#0f172a",
    color: "#fff",
    fontSize: "10px",
    fontWeight: "bold",
    padding: "4px 10px",
    borderRadius: "20px",
    zIndex: 2,
  },

  wishlistButton: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background:
      "rgba(0, 0, 0, 0.4)",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99,
  },

  image: {
    width: "85%",
    height: "85%",
    objectFit: "contain",
  },

  content: {
    padding: "20px",
    color: "#ffffff",
  },

  subCategory: {
    fontSize: "11px",
    color: "#93c5fd",
    fontWeight: "bold",
    margin: "0 0 6px",
  },

  name: {
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0 0 8px",
    color: "#ffffff",
    cursor: "pointer",
  },

  description: {
    fontSize: "13px",
    color: "#9ca3af",
    margin: "0 0 14px",
  },

  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  price: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#ffffff",
  },

  cartButton: {
    width: "100%",
    border: "none",
    borderRadius: "12px",
    padding: "13px",
    background:
      "linear-gradient(90deg, #2962ff, #713cff)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
    marginBottom: "10px",
  },

  detailsButton: {
    width: "100%",
    border: "1px solid #6366f1",
    borderRadius: "12px",
    padding: "12px",
    background: "transparent",
    color: "#a5b4fc",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default ProductCard;