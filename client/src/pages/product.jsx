import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function CategoryProducts() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        const filteredProducts = data.filter(
          (product) =>
            product?.category?.toLowerCase() ===
            category?.toLowerCase()
        );

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Category products error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <button
          onClick={() => navigate("/")}
          style={styles.backButton}
        >
          ← Back
        </button>

        <div>
          <p style={styles.label}>CATEGORY</p>

          <h1 style={styles.title}>
            {category}
          </h1>

          <p style={styles.count}>
            {products.length} products available
          </p>
        </div>
      </div>

      {/* PRODUCTS */}
      <div style={styles.container}>
        {loading ? (
          <div style={styles.message}>
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div style={styles.message}>
            <h2>No products found</h2>

            <p>
              There are currently no products in{" "}
              {category}.
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {products.map((product) => (
              <div
                key={product._id}
                style={styles.card}
                onClick={() =>
                  navigate(`/product/${product._id}`)
                }
              >
                {/* IMAGE */}
                <div style={styles.imageBox}>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={styles.image}
                    />
                  ) : (
                    <div style={styles.noImage}>
                      No Image
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div style={styles.info}>
                  <p style={styles.category}>
                    {product.category}
                  </p>

                  <h2 style={styles.name}>
                    {product.name}
                  </h2>

                  <p style={styles.description}>
                    {product.description ||
                      "No description available"}
                  </p>

                  <div style={styles.bottom}>
                    <strong style={styles.price}>
                      ₹
                      {Number(
                        product.price || 0
                      ).toLocaleString("en-IN")}
                    </strong>

                    <span style={styles.stock}>
                      {product.stock > 0
                        ? `${product.stock} available`
                        : "Out of stock"}
                    </span>
                  </div>

                  <button
                    style={styles.viewButton}
                    onClick={(e) => {
                      e.stopPropagation();

                      navigate(
                        `/product/${product._id}`
                      );
                    }}
                  >
                    View Product →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f7f8",
    paddingBottom: "60px",
  },

  header: {
    padding: "40px 6%",
    background: "#111827",
    color: "white",
  },

  backButton: {
    border: "none",
    background: "transparent",
    color: "white",
    fontSize: "15px",
    cursor: "pointer",
    marginBottom: "25px",
  },

  label: {
    fontSize: "12px",
    letterSpacing: "3px",
    opacity: 0.7,
    margin: "0 0 8px",
  },

  title: {
    fontSize: "42px",
    margin: 0,
    textTransform: "capitalize",
  },

  count: {
    opacity: 0.7,
    marginTop: "10px",
  },

  container: {
    padding: "40px 6%",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "24px",
  },

  card: {
    background: "white",
    borderRadius: "18px",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow:
      "0 6px 20px rgba(0, 0, 0, 0.08)",
    transition: "transform 0.2s ease",
  },

  imageBox: {
    height: "230px",
    background: "#f1f1f1",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  noImage: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#888",
  },

  info: {
    padding: "20px",
  },

  category: {
    fontSize: "12px",
    color: "#777",
    margin: "0 0 6px",
  },

  name: {
    fontSize: "20px",
    margin: "0 0 8px",
  },

  description: {
    fontSize: "14px",
    color: "#666",
    lineHeight: 1.5,
    height: "42px",
    overflow: "hidden",
    marginBottom: "15px",
  },

  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },

  price: {
    fontSize: "20px",
  },

  stock: {
    fontSize: "12px",
    color: "#777",
  },

  viewButton: {
    width: "100%",
    marginTop: "18px",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#111827",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },

  message: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#666",
  },
};

export default CategoryProducts;