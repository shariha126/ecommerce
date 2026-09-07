import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
  const fetchProduct = async () => {
    try {
      setLoading(true);

      const data = await api(`/products/${id}`);

      console.log("Product details received:", data);

      setProduct(data);
    } catch (error) {
      console.error("Product details error:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchProduct();
  }
}, [id]);

  const addToCart = () => {
    if (!product || product.stock <= 0) return;

    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = existingCart.find(
      (item) => item._id === product._id
    );

    let updatedCart;

    if (existingProduct) {
      updatedCart = existingCart.map((item) =>
        item._id === product._id
          ? {
              ...item,
              quantity: Math.min(
                item.quantity + quantity,
                product.stock
              ),
            }
          : item
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          ...product,
          quantity,
        },
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    alert("Product added to cart 🛒");
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={styles.center}>
        <h2>Product not found</h2>

        <button
          style={styles.backButton}
          onClick={() => navigate(-1)}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <button
        style={styles.backButton}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div style={styles.detailsCard}>
        {/* IMAGE */}
        <div style={styles.imageSection}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              style={styles.image}
            />
          ) : (
            <div style={styles.noImage}>
              No Image Available
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div style={styles.infoSection}>
          <p style={styles.category}>
            {product.category}
          </p>

          <h1 style={styles.name}>
            {product.name}
          </h1>

          <div style={styles.price}>
            ₹
            {Number(product.price || 0).toLocaleString(
              "en-IN"
            )}
          </div>

          <div style={styles.stock}>
            {product.stock > 0
              ? `✓ ${product.stock} available`
              : "✕ Out of stock"}
          </div>

          <div style={styles.line} />

          <h3>Description</h3>

          <p style={styles.description}>
            {product.description ||
              "No description available for this product."}
          </p>

          {/* QUANTITY */}
          {product.stock > 0 && (
            <div style={styles.quantitySection}>
              <span>Quantity</span>

              <div style={styles.quantityBox}>
                <button
                  onClick={() =>
                    setQuantity(
                      Math.max(1, quantity - 1)
                    )
                  }
                  style={styles.quantityButton}
                >
                  −
                </button>

                <span style={styles.quantity}>
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity(
                      Math.min(
                        product.stock,
                        quantity + 1
                      )
                    )
                  }
                  style={styles.quantityButton}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* ADD TO CART */}
          <button
            onClick={addToCart}
            disabled={product.stock <= 0}
            style={{
              ...styles.cartButton,
              opacity: product.stock <= 0 ? 0.5 : 1,
              cursor:
                product.stock <= 0
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {product.stock > 0
              ? "🛒 Add to Cart"
              : "Out of Stock"}
          </button>

          <button
            onClick={() => navigate("/")}
            style={styles.continueButton}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f7f8",
    padding: "30px 6% 70px",
  },

  backButton: {
    border: "none",
    background: "transparent",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "25px",
  },

  detailsCard: {
    maxWidth: "1100px",
    margin: "0 auto",
    background: "white",
    borderRadius: "24px",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns:
      "minmax(300px, 1fr) minmax(300px, 1fr)",
    boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
  },

  imageSection: {
    minHeight: "550px",
    background: "#f1f1f1",
  },

  image: {
    width: "100%",
    height: "100%",
    minHeight: "550px",
    objectFit: "cover",
  },

  noImage: {
    height: "100%",
    minHeight: "550px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#888",
    fontSize: "18px",
  },

  infoSection: {
    padding: "50px",
  },

  category: {
    color: "#777",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "2px",
    fontWeight: "600",
  },

  name: {
    fontSize: "40px",
    lineHeight: "1.1",
    margin: "12px 0 20px",
  },

  price: {
    fontSize: "32px",
    fontWeight: "800",
    marginBottom: "12px",
  },

  stock: {
    fontSize: "14px",
    color: "#555",
  },

  line: {
    height: "1px",
    background: "#eee",
    margin: "25px 0",
  },

  description: {
    color: "#666",
    lineHeight: "1.7",
    fontSize: "16px",
  },

  quantitySection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "30px",
    marginBottom: "20px",
  },

  quantityBox: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "10px",
    overflow: "hidden",
  },

  quantityButton: {
    width: "40px",
    height: "40px",
    border: "none",
    background: "#f5f5f5",
    fontSize: "20px",
    cursor: "pointer",
  },

  quantity: {
    width: "45px",
    textAlign: "center",
    fontWeight: "600",
  },

  cartButton: {
    width: "100%",
    padding: "16px",
    border: "none",
    borderRadius: "12px",
    background: "#111827",
    color: "white",
    fontSize: "16px",
    fontWeight: "700",
  },

  continueButton: {
    width: "100%",
    padding: "14px",
    marginTop: "12px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    background: "white",
    fontWeight: "600",
    cursor: "pointer",
  },

  center: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default ProductDetails;