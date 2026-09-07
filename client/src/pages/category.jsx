import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";

function Category() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formattedCategory =
    category === "all"
      ? "All Products"
      : category
          ?.replace(/-/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase());

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://10.21.153.90:5000/api/products"
        );

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        console.log("API DATA:", data);

        const allProducts = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
          ? data.products
          : [];

        console.log("TOTAL PRODUCTS:", allProducts.length);

        // Show every product for /category/all
        if (!category || category.toLowerCase() === "all") {
          setProducts(allProducts);
          return;
        }

        const wantedCategory = category
          .toLowerCase()
          .replace(/-/g, " ")
          .trim();

        console.log("URL CATEGORY:", wantedCategory);

        const filtered = allProducts.filter((product) => {
          const productCategory = String(
            product.category || ""
          )
            .toLowerCase()
            .trim();

          console.log(
            "PRODUCT:",
            product.name,
            "CATEGORY:",
            productCategory
          );

          return (
            productCategory === wantedCategory ||
            productCategory.includes(wantedCategory) ||
            wantedCategory.includes(productCategory)
          );
        });

        console.log("FILTERED PRODUCTS:", filtered.length);

        setProducts(filtered);
      } catch (err) {
        console.error("FETCH ERROR:", err);
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [category]);

  return (
    <div style={styles.page}>

      <section style={styles.hero}>

        <button
          onClick={() => navigate("/")}
          style={styles.backButton}
        >
          ← Back to Home
        </button>

        <p style={styles.brand}>
          TECHVAULT360
        </p>

        <h1 style={styles.title}>
          {formattedCategory}
        </h1>

        <p style={styles.subtitle}>
          Discover premium products selected just for you.
        </p>

        <div style={styles.count}>
          📦 {products.length} Products Available
        </div>

      </section>

      <section style={styles.productsSection}>

        {loading && (
          <div style={styles.message}>
            <div style={styles.emptyIcon}>⏳</div>
            <h2>Loading Products...</h2>
          </div>
        )}

        {!loading && error && (
          <div style={styles.message}>
            <div style={styles.emptyIcon}>⚠️</div>
            <h2>Unable to Load Products</h2>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div style={styles.grid}>
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div style={styles.message}>
            <div style={styles.emptyIcon}>📦</div>

            <h2>No products found</h2>

            <p>
              There are currently no products in{" "}
              <strong>{formattedCategory}</strong>.
            </p>

            <button
              onClick={() => navigate("/category/all")}
              style={styles.exploreButton}
            >
              Explore All Products
            </button>
          </div>
        )}

      </section>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#050509",
    color: "#ffffff",
  },

  hero: {
    background:
      "linear-gradient(135deg, #171343 0%, #24247d 50%, #173b82 100%)",
    padding: "55px 7% 70px",
    boxSizing: "border-box",
  },

  backButton: {
    border: "none",
    background: "rgba(255,255,255,0.08)",
    color: "#dddfff",
    padding: "14px 22px",
    borderRadius: "14px",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "55px",
  },

  brand: {
    color: "#8997ff",
    fontSize: "14px",
    fontWeight: "800",
    letterSpacing: "5px",
    marginBottom: "20px",
  },

  title: {
    fontSize: "clamp(48px, 8vw, 78px)",
    lineHeight: "1",
    margin: "0 0 25px",
    fontWeight: "900",
  },

  subtitle: {
    fontSize: "20px",
    color: "#c4c5dc",
    marginBottom: "30px",
  },

  count: {
    display: "inline-block",
    padding: "12px 22px",
    borderRadius: "30px",
    border: "1px solid rgba(130,140,255,0.4)",
    background: "rgba(80,80,200,0.2)",
    color: "#b8baff",
    fontSize: "16px",
  },

  productsSection: {
    padding: "55px 7% 100px",
    boxSizing: "border-box",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "28px",
    maxWidth: "1100px",
    margin: "0 auto",
  },

  message: {
    minHeight: "450px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#b6b7c9",
  },

  emptyIcon: {
    fontSize: "70px",
    marginBottom: "20px",
  },

  exploreButton: {
    marginTop: "25px",
    border: "none",
    borderRadius: "14px",
    padding: "16px 30px",
    background:
      "linear-gradient(90deg, #2962ff, #713cff)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default Category;