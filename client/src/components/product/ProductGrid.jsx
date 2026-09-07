import ProductCard from "./ProductCard";

function ProductGrid({ products = [] }) {
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div style={styles.empty}>
        <p>No products available.</p>
      </div>
    );
  }

  return (
    <div style={styles.grid}>
      {products
        .filter((product) => product && typeof product === "object")
        .map((product) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
          />
        ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "24px",
    padding: "20px 0",
  },

  empty: {
    textAlign: "center",
    padding: "50px 20px",
    fontSize: "18px",
  },
};

export default ProductGrid;