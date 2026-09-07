import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  ArrowLeft,
  Star,
  Package,
} from "lucide-react";

const ProductScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistVersion, setWishlistVersion] = useState(0);

  const navigate = useNavigate();
  const { category } = useParams();

  // --------------------------------------------------
  // CATEGORY NAME
  // --------------------------------------------------

  const categoryNames = {
    electronics: "Electronics",
    fashion: "Fashion",
    "home-kitchen": "Home & Kitchen",
    beauty: "Beauty",
    sports: "Sports",
    accessories: "Accessories",
    "books-stationery": "Books & Stationery",
    "toys-games": "Toys & Games",
    automotive: "Automotive",
  };

  const currentCategory = category
    ? categoryNames[category.toLowerCase()] || category
    : "All Products";

  // --------------------------------------------------
  // FETCH PRODUCTS
  // --------------------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          "http://localhost:5000/api/products"
        );

        let productList = Array.isArray(response.data)
          ? response.data
          : [];

        if (category) {
          const targetCategory = category.trim().toLowerCase();
          productList = productList.filter((product) => {
            const prodCategory = product.category || product.type || "";
            return prodCategory.trim().toLowerCase() === targetCategory;
          });
        }

        setProducts(productList);
      } catch (error) {
        console.error("PRODUCT FETCH ERROR:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // --------------------------------------------------
  // IMAGE FALLBACK
  // --------------------------------------------------

  const getImage = (product) => {
    if (product.image && product.image.trim() !== "") {
      return product.image;
    }

    return `https://picsum.photos/seed/${product._id}/600/500`;
  };

  // --------------------------------------------------
  // STOCK
  // --------------------------------------------------

  const getStock = (product) => {
    if (product.countInStock !== undefined) {
      return Number(product.countInStock);
    }

    if (product.stock !== undefined) {
      return Number(product.stock);
    }

    return 0;
  };

  // --------------------------------------------------
  // PRICE
  // --------------------------------------------------

  const getPrice = (product) => {
    return Number(product.price || 0).toLocaleString(
      "en-IN"
    );
  };

  // --------------------------------------------------
  // VIEW PRODUCT
  // --------------------------------------------------

  const openProduct = (id) => {
    navigate(`/product/${id}`);
  };

  // --------------------------------------------------
  // ADD TO CART
  // --------------------------------------------------

  const handleAddToCart = (event, product) => {
    event.stopPropagation();

    const stock = getStock(product);

    if (stock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    // Save product to localStorage cart
    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = existingCart.find(
      (item) => item._id === product._id
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      existingCart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(existingCart)
    );

    alert(`${product.name} added to cart 🛒`);
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loader}></div>

        <h2>Loading Products...</h2>

        <p>Discovering something amazing for you ✨</p>
      </div>
    );
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div style={styles.page}>

      {/* ==========================================
          HERO
      ========================================== */}

      <section style={styles.hero}>

        <div style={styles.heroGlow}></div>

        <button
          style={styles.backButton}
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div style={styles.smallTitle}>
          TECHVAULT360
        </div>

        <h1 style={styles.title}>
          {currentCategory}
        </h1>

        <p style={styles.subtitle}>
          Discover premium products selected just
          for you.
        </p>

        <div style={styles.productCount}>
          <Package size={16} />
          {products.length} Products Available
        </div>

      </section>

      {/* ==========================================
          PRODUCT AREA
      ========================================== */}

      <section style={styles.section}>

        {products.length === 0 ? (

          // ========================================
          // EMPTY
          // ========================================

          <div style={styles.empty}>

            <div style={styles.emptyIcon}>
              📦
            </div>

            <h2>No products found</h2>

            <p>
              There are currently no products in{" "}
              <strong>{currentCategory}</strong>.
            </p>

            <button
              style={styles.exploreButton}
              onClick={() => navigate("/products")}
            >
              Explore All Products
            </button>

          </div>

        ) : (

          <>

            {/* ======================================
                TOP BAR
            ====================================== */}

            <div style={styles.topBar}>

              <div>
                <span style={styles.showing}>
                  Showing
                </span>{" "}
                <strong>{products.length}</strong>{" "}
                products
              </div>

              <select style={styles.select}>
                <option>Sort by: Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Product Name</option>
              </select>

            </div>

            {/* ======================================
                PRODUCT GRID
                2 PRODUCTS PER ROW
            ====================================== */}

            <div style={styles.grid}>

              {products.map((product) => {
                const stock = getStock(product);
                const productId = product._id || product.id;

                // Check if this specific product is wishlisted
                const isWishlisted = (() => {
                  try {
                    const wishlist = JSON.parse(
                      localStorage.getItem("wishlist") || "[]"
                    );
                    return wishlist.some(
                      (item) => (item._id || item.id) === productId
                    );
                  } catch {
                    return false;
                  }
                })();

                // Toggle wishlist handler
                const handleWishlistClick = (event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  try {
                    let wishlist = JSON.parse(
                      localStorage.getItem("wishlist") || "[]"
                    );
                    const exists = wishlist.some(
                      (item) => (item._id || item.id) === productId
                    );

                    if (exists) {
                      wishlist = wishlist.filter(
                        (item) => (item._id || item.id) !== productId
                      );
                    } else {
                      wishlist.push(product);
                    }

                    localStorage.setItem(
                      "wishlist",
                      JSON.stringify(wishlist)
                    );
                    window.dispatchEvent(
                      new Event("wishlistUpdated")
                    );

                    setWishlistVersion((prev) => prev + 1);
                  } catch (error) {
                    console.error("Wishlist error:", error);
                  }
                };

                return (
                  <div
                    key={productId}
                    style={styles.card}
                    onClick={() =>
                      openProduct(productId)
                    }
                  >

                    {/* IMAGE */}

                    <div style={styles.imageContainer}>

                      <img
                        src={getImage(product)}
                        alt={
                          product.name ||
                          "Product"
                        }
                        style={styles.image}
                        onError={(event) => {
                          event.currentTarget.src =
                            "https://picsum.photos/600/500";
                        }}
                      />

                      {/* CATEGORY BADGE */}

                      <div style={styles.categoryBadge}>
                        {product.category ||
                          "Product"}
                      </div>

                      {/* WISHLIST */}

                      <button
                        style={{
                          ...styles.wishlist,
                          color: isWishlisted ? "#ef4444" : "#ffffff",
                          background: isWishlisted ? "rgba(239, 68, 68, 0.15)" : "rgba(10,10,25,0.75)",
                          borderColor: isWishlisted ? "#ef4444" : "rgba(255,255,255,0.15)",
                        }}
                        onClick={handleWishlistClick}
                        type="button"
                      >
                        <Heart
                          size={20}
                          fill={isWishlisted ? "#ef4444" : "transparent"}
                        />
                      </button>

                    </div>

                    {/* PRODUCT INFO */}

                    <div style={styles.info}>

                      <div style={styles.productCategory}>
                        {product.category ||
                          "PRODUCT"}
                      </div>

                      <h2 style={styles.name}>
                        {product.name ||
                          "Unnamed Product"}
                      </h2>

                      <p style={styles.description}>
                        {product.description ||
                          "Premium quality product from TechVault360."}
                      </p>

                      {/* RATING */}

                      <div style={styles.rating}>
                        <Star
                          size={16}
                          fill="#fbbf24"
                          color="#fbbf24"
                        />

                        <strong>4.7</strong>

                        <span>
                          (128 reviews)
                        </span>
                      </div>

                      {/* PRICE */}

                      <div style={styles.priceRow}>

                        <span style={styles.price}>
                          ₹{getPrice(product)}
                        </span>

                      </div>

                      {/* STOCK */}

                      <div
                        style={
                          stock > 0
                            ? styles.stock
                            : styles.outOfStock
                        }
                      >
                        <span style={styles.dot}></span>

                        {stock > 0
                          ? `${stock} available`
                          : "Out of stock"}
                      </div>

                      {/* ADD CART */}

                      <button
                        style={
                          stock > 0
                            ? styles.cartButton
                            : styles.disabledButton
                        }
                        disabled={stock <= 0}
                        onClick={(event) =>
                          handleAddToCart(
                            event,
                            product
                          )
                        }
                      >
                        <ShoppingCart size={18} />

                        {stock > 0
                          ? "Add to Cart"
                          : "Out of Stock"}
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>

          </>
        )}

      </section>
    </div>
  );
};

// ==================================================
// STYLES
// ==================================================

const styles = {

  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, #15152e 0%, #080812 45%, #050509 100%)",
    color: "#ffffff",
    paddingBottom: "80px",
  },

  hero: {
    position: "relative",
    overflow: "hidden",
    padding: "45px 7% 55px",
    background:
      "linear-gradient(135deg, #11112b, #17134b 45%, #102c63)",
    borderBottom:
      "1px solid rgba(255,255,255,0.08)",
  },

  heroGlow: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background:
      "rgba(91, 76, 255, 0.18)",
    filter: "blur(90px)",
    right: "-100px",
    top: "-150px",
  },

  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "none",
    background: "rgba(255,255,255,0.07)",
    color: "#d7d7ff",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "35px",
  },

  smallTitle: {
    color: "#7c8cff",
    letterSpacing: "4px",
    fontSize: "13px",
    fontWeight: "800",
    marginBottom: "12px",
  },

  title: {
    fontSize: "48px",
    margin: "0",
    fontWeight: "800",
    background:
      "linear-gradient(90deg, #ffffff, #8ea2ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    color: "#b8b8cc",
    fontSize: "16px",
    marginTop: "12px",
  },

  productCount: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "18px",
    padding: "9px 15px",
    borderRadius: "30px",
    background: "rgba(80,90,255,0.15)",
    border:
      "1px solid rgba(120,130,255,0.25)",
    color: "#aab6ff",
    fontSize: "14px",
  },

  section: {
    width: "86%",
    maxWidth: "1450px",
    margin: "0 auto",
    paddingTop: "35px",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    color: "#d8d8e8",
  },

  showing: {
    color: "#85859b",
  },

  select: {
    background: "#11111f",
    color: "#ffffff",
    border:
      "1px solid rgba(255,255,255,0.12)",
    padding: "11px 16px",
    borderRadius: "10px",
    outline: "none",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "28px",
  },

  card: {
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.035))",
    border:
      "1px solid rgba(255,255,255,0.10)",
    borderRadius: "22px",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow:
      "0 20px 50px rgba(0,0,0,0.25)",
    backdropFilter: "blur(18px)",
    transition:
      "transform 0.25s ease, border 0.25s ease",
  },

  imageContainer: {
    position: "relative",
    height: "300px",
    background:
      "linear-gradient(145deg, #161625, #22223b)",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  categoryBadge: {
    position: "absolute",
    left: "16px",
    top: "16px",
    padding: "7px 12px",
    borderRadius: "20px",
    background:
      "rgba(30,30,55,0.85)",
    border:
      "1px solid rgba(255,255,255,0.15)",
    color: "#aeb9ff",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  wishlist: {
    position: "absolute",
    right: "16px",
    top: "16px",
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border:
      "1px solid rgba(255,255,255,0.15)",
    background:
      "rgba(10,10,25,0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 10,
  },

  info: {
    padding: "24px",
  },

  productCategory: {
    color: "#798cff",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginBottom: "8px",
  },

  name: {
    margin: "0",
    fontSize: "24px",
    color: "#ffffff",
    fontWeight: "750",
  },

  description: {
    color: "#9292a8",
    fontSize: "14px",
    lineHeight: "1.6",
    margin:
      "10px 0 15px",
    minHeight: "45px",
  },

  rating: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    color: "#f5f5f5",
  },

  priceRow: {
    marginTop: "16px",
  },

  price: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#ffffff",
  },

  stock: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "10px",
    color: "#55d69a",
    fontSize: "13px",
  },

  outOfStock: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "10px",
    color: "#ff6b7a",
    fontSize: "13px",
  },

  dot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#55d69a",
  },

  cartButton: {
    width: "100%",
    marginTop: "18px",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(90deg, #315cff, #7048ff)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "750",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    boxShadow:
      "0 8px 25px rgba(65,80,255,0.25)",
  },

  disabledButton: {
    width: "100%",
    marginTop: "18px",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background: "#292936",
    color: "#777783",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "not-allowed",
  },

  empty: {
    textAlign: "center",
    padding: "100px 20px",
    color: "#aaaabc",
  },

  emptyIcon: {
    fontSize: "60px",
    marginBottom: "15px",
  },

  exploreButton: {
    marginTop: "20px",
    padding: "13px 24px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(90deg, #315cff, #7048ff)",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },

  loadingPage: {
    minHeight: "100vh",
    background: "#080812",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  loader: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    border:
      "4px solid rgba(255,255,255,0.1)",
    borderTop:
      "4px solid #6175ff",
    animation:
      "spin 1s linear indefinite",
      marginBottom: "20px",
  },
};

export default ProductScreen;