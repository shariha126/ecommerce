import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Sparkles,
  Flame,
  ShoppingCart,
} from "lucide-react";

import api from "../api/api";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api("/products");

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data?.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = (product) => {
    try {
      const oldCart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      const existing = oldCart.find(
        (item) => item._id === product._id
      );

      let newCart;

      if (existing) {
        newCart = oldCart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: Number(item.quantity || 1) + 1,
              }
            : item
        );
      } else {
        newCart = [
          ...oldCart,
          {
            ...product,
            quantity: 1,
          },
        ];
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(newCart)
      );

      window.dispatchEvent(new Event("cartUpdated"));

      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  // =====================================================
  // PRODUCT IMAGE
  // =====================================================

  const getImage = (product) => {
    if (!product?.image) {
      return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800";
    }

    if (
      product.image.startsWith("http://") ||
      product.image.startsWith("https://")
    ) {
      return product.image;
    }

    if (product.image.startsWith("/")) {
      return `http://localhost:5000${product.image}`;
    }

    return `http://localhost:5000/${product.image}`;
  };

  // =====================================================
  // CATEGORY DATA
  // =====================================================

  const categories = [
    {
      name: "Electronics",
      path: "/category/electronics",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=700",
      count: "120+ Products",
    },
    {
      name: "Fashion",
      path: "/category/fashion",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=700",
      count: "220+ Products",
    },
    {
      name: "Home & Kitchen",
      path: "/category/home-kitchen",
      image:
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=700",
      count: "100+ Products",
    },
    {
      name: "Beauty",
      path: "/category/beauty",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=700",
      count: "150+ Products",
    },
    {
      name: "Sports",
      path: "/category/sports",
      image:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=700",
      count: "90+ Products",
    },
    {
      name: "Accessories",
      path: "/category/accessories",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700",
      count: "200+ Products",
    },
  ];

  // =====================================================
  // DISPLAY PRODUCTS
  // =====================================================

  const trendingProducts = products.slice(0, 8);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading-circle"></div>
        <h3>Loading TechVault360...</h3>
        <p>Preparing something amazing for you ✨</p>
      </div>
    );
  }

  return (
    <div className="home-page">

      {/* =================================================
          HERO SECTION
      ================================================= */}

      <section className="hero-section">

        <div className="hero-container">

          {/* LEFT CATEGORY SIDEBAR */}

          <aside className="hero-sidebar">

            <div className="sidebar-title">
              <span>☰</span>
              <strong>All Categories</strong>
              <ChevronRight size={17} />
            </div>

            <Link to="/category/electronics">
              📱 Electronics
              <ChevronRight size={14} />
            </Link>

            <Link to="/category/fashion">
              👗 Fashion
              <ChevronRight size={14} />
            </Link>

            <Link to="/category/home-kitchen">
              🏠 Home & Kitchen
              <ChevronRight size={14} />
            </Link>

            <Link to="/category/beauty">
              💄 Beauty
              <ChevronRight size={14} />
            </Link>

            <Link to="/category/sports">
              ⚽ Sports
              <ChevronRight size={14} />
            </Link>

            <Link to="/category/accessories">
              🎧 Accessories
              <ChevronRight size={14} />
            </Link>

            <Link to="/products">
              📦 Books & Stationery
              <ChevronRight size={14} />
            </Link>

            <Link to="/products">
              🎮 Toys & Games
              <ChevronRight size={14} />
            </Link>

            <Link to="/products">
              🚗 Automotive
              <ChevronRight size={14} />
            </Link>

            <Link to="/products">
              ✨ More Categories
              <ChevronRight size={14} />
            </Link>

          </aside>

          {/* HERO BANNER */}

          <div className="hero-banner">

            <div className="hero-content">

              <div className="hero-sale">
                <Sparkles size={15} />
                MEGA SUMMER SALE
              </div>

              <h1>
                Tech. Style. You.
                <br />
                <span>All in One Place.</span>
              </h1>

              <p>
                Discover premium products at
                unbeatable prices.
              </p>

              <div className="hero-buttons">

                <Link
                  to="/products"
                  className="hero-primary-btn"
                >
                  Shop Now
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/products?filter=deals"
                  className="hero-secondary-btn"
                >
                  Explore Deals
                </Link>

              </div>

            </div>

            <div className="hero-visual">

              <div className="hero-circle circle-one"></div>
              <div className="hero-circle circle-two"></div>

              <img
                src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=900"
                alt="Premium headphones"
              />

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          BENEFITS
      ================================================= */}

      <section className="benefits-section">

        <div className="benefit-card">

          <div className="benefit-icon blue">
            <Truck size={25} />
          </div>

          <div>
            <h4>Free Shipping</h4>
            <p>On orders above ₹999</p>
          </div>

        </div>

        <div className="benefit-card">

          <div className="benefit-icon pink">
            <RotateCcw size={25} />
          </div>

          <div>
            <h4>Easy Returns</h4>
            <p>7 days return policy</p>
          </div>

        </div>

        <div className="benefit-card">

          <div className="benefit-icon green">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h4>Secure Payment</h4>
            <p>100% protected checkout</p>
          </div>

        </div>

        <div className="benefit-card">

          <div className="benefit-icon purple">
            <Headphones size={25} />
          </div>

          <div>
            <h4>24/7 Support</h4>
            <p>Always here to help</p>
          </div>

        </div>

      </section>

      {/* =================================================
          CATEGORY SECTION
      ================================================= */}

      <section className="category-section">

        <div className="section-heading">

          <div>
            <span className="small-heading">
              EXPLORE COLLECTION
            </span>

            <h2>Shop by Category</h2>
          </div>

          <Link to="/products">
            View All
            <ArrowRight size={17} />
          </Link>

        </div>

        <div className="category-grid">

          {categories.map((category) => (
            <Link
              to={category.path}
              className="category-card"
              key={category.name}
            >

              <div className="category-image">

                <img
                  src={category.image}
                  alt={category.name}
                />

              </div>

              <div className="category-info">

                <h3>{category.name}</h3>

                <p>{category.count}</p>

              </div>

            </Link>
          ))}

        </div>

      </section>

      {/* =================================================
          TRENDING PRODUCTS
      ================================================= */}

      {trendingProducts.map((product) => {
  const stock = Number(
    product.countInStock ??
    product.stock ??
    0
  );

  const productId = product._id || product.id;
  
  // Check if this product is already wishlisted
  const isWishlisted = (() => {
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      return wishlist.some((item) => (item._id || item.id) === productId);
    } catch {
      return false;
    }
  })();

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const exists = wishlist.some((item) => (item._id || item.id) === productId);

      if (exists) {
        wishlist = wishlist.filter((item) => (item._id || item.id) !== productId);
      } else {
        wishlist.push(product);
      }

      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      window.dispatchEvent(new Event("wishlistUpdated"));
      
      // Force component to re-render so heart changes color immediately
      setProducts([...products]);
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  return (
    <div
      className="home-product-card"
      key={product._id}
    >
      {/* DISCOUNT BADGE */}
      <div className="product-discount">
        -{Math.floor(Math.random() * 25) + 10}%
      </div>

      {/* WISHLIST BUTTON */}
      <button 
        type="button"
        className="product-heart"
        onClick={handleWishlistClick}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: "20px",
          color: isWishlisted ? "#ef4444" : "#ffffff",
        }}
      >
        {isWishlisted ? "♥" : "♡"}
      </button>

      {/* IMAGE */}
      <Link
        to={`/product/${product._id}`}
        className="home-product-image"
      >
        <img
          src={getImage(product)}
          alt={product.name}
        />
      </Link>

      {/* PRODUCT INFO */}
      <div className="home-product-info">
        <span className="product-category">
          {product.category || "General"}
        </span>

        <Link
          to={`/product/${product._id}`}
        >
          <h3>{product.name}</h3>
        </Link>

        {/* RATING */}
        <div className="product-rating">
          <span>
            <Star
              size={14}
              fill="currentColor"
            />
            4.7
          </span>
          <small>
            ({Math.floor(Math.random() * 500) + 50})
          </small>
        </div>

        {/* PRICE */}
        <div className="product-price-row">
          <strong>
            ₹{Number(product.price || 0).toLocaleString("en-IN")}
          </strong>
          <del>
            ₹{Number((product.price || 0) * 1.2).toLocaleString("en-IN")}
          </del>
        </div>

        {/* STOCK */}
        <div className="stock-info">
          {stock > 0 ? (
            <>
              <span className="stock-dot"></span>
              {stock} available
            </>
          ) : (
            <span className="out-stock">
              Out of stock
            </span>
          )}
        </div>

        {/* CART */}
        <button
          className="home-add-cart"
          disabled={stock === 0}
          onClick={() => addToCart(product)}
        >
          <ShoppingCart size={17} />
          {stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
})}

      {/* =================================================
          PROMOTIONAL BANNER
      ================================================= */}

      <section className="home-promo">

        <div className="promo-content">

          <span>
            LIMITED TIME OFFER
          </span>

          <h2>
            Upgrade Your Lifestyle.
          </h2>

          <p>
            Grab amazing products with
            exclusive discounts.
          </p>

          <Link to="/products?filter=deals">
            Shop Deals
            <ArrowRight size={18} />
          </Link>

        </div>

        <div className="promo-icons">
          🎧 📱 💻 ⌚
        </div>

      </section>

      {/* =================================================
          WHY TECHVAULT
      ================================================= */}
     

      <section className="why-section">

        <div className="why-header">

          <span className="small-heading">
            WHY TECHVAULT360
          </span>

          <h2>
            Shopping Made Better
          </h2>

          <p>
            Everything you need, carefully selected
            and delivered with trust.
          </p>

        </div>

        <div className="why-grid">

          <div className="why-card">

            <div>💎</div>

            <h3>Quality Products</h3>

            <p>
              Carefully selected products from
              trusted brands.
            </p>

          </div>

          <div className="why-card">

            <div>⚡</div>

            <h3>Fast Delivery</h3>

            <p>
              Get your favourite products
              delivered quickly.
            </p>

          </div>

          <div className="why-card">

            <div>🔒</div>

            <h3>Safe & Secure</h3>

            <p>
              Your information and payments
              are always protected.
            </p>

          </div>

          <div className="why-card">

            <div>💖</div>

            <h3>Customer First</h3>

            <p>
              We put your shopping experience
              first, every time.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;