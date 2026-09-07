import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
  Menu,
  X,
  Truck,
  Tag,
  Sparkles,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [categoriesDropdown, setCategoriesDropdown] = useState(false); // State to toggle category dropdown
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // --------------------------------------------------
  // GET CART COUNT
  // --------------------------------------------------
  useEffect(() => {
    const updateCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");

        const count = cart.reduce(
          (total, item) => total + Number(item.quantity || 1),
          0
        );

        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    updateCart();

    window.addEventListener("storage", updateCart);
    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  // --------------------------------------------------
  // GET WISHLIST COUNT (WITH LIVE EVENT LISTENER)
  // --------------------------------------------------
  useEffect(() => {
    const updateWishlistCount = () => {
      try {
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishlistCount(wishlist.length);
      } catch {
        setWishlistCount(0);
      }
    };

    updateWishlistCount();

    window.addEventListener("storage", updateWishlistCount);
    window.addEventListener("wishlistUpdated", updateWishlistCount);

    return () => {
      window.removeEventListener("storage", updateWishlistCount);
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
    };
  }, []);

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------
  const handleSearch = (e) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) {
      navigate("/products");
      return;
    }

    navigate(`/products?search=${encodeURIComponent(value)}`);
    setMobileMenu(false);
  };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

    window.location.reload();
  };

  return (
    <>
      {/* =================================================
          TOP OFFER BAR
      ================================================= */}
      <div className="top-offer-bar">
        <div className="offer-content">

          <span>
            🚚 Free shipping on orders above ₹999
          </span>

          <span className="offer-divider">|</span>

          <span>
            <Sparkles size={14} />
            Mega Summer Sale — Up to 60% OFF
          </span>

          <span className="offer-divider">|</span>

          <span>
            Easy 7-day returns
          </span>

        </div>
      </div>

      {/* =================================================
          MAIN NAVBAR
      ================================================= */}
      <header className="main-navbar">

        <div className="navbar-container">

          {/* LOGO */}
          <Link to="/" className="navbar-logo">
            TechVault<span>360</span>
          </Link>

          {/* SEARCH */}
          <form
            className="navbar-search"
            onSubmit={handleSearch}
          >
            <Search
              size={19}
              className="search-icon"
            />

            <input
              type="text"
              placeholder="Search for products, brands and more..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button type="submit">
              <Search size={19} />
            </button>
          </form>

          {/* DESKTOP ACTIONS */}
          <div className="navbar-actions">

            {/* WISHLIST */}
            <Link
              to="/wishlist"
              className="nav-action"
            >
              <div className="nav-icon-wrapper">
                <Heart size={22} />

                {wishlistCount > 0 && (
                  <span className="nav-badge">
                    {wishlistCount}
                  </span>
                )}
              </div>

              <small>Wishlist</small>
            </Link>

            {/* CART */}
            <Link
              to="/cart"
              className="nav-action"
            >
              <div className="nav-icon-wrapper">
                <ShoppingCart size={23} />

                {cartCount > 0 && (
                  <span className="nav-badge">
                    {cartCount}
                  </span>
                )}
              </div>

              <small>Cart</small>
            </Link>

            {/* PROFILE */}
            <Link
              to="/login"
              className="profile-button"
            >
              <div className="profile-circle">
                <User size={19} />
              </div>
            </Link>

          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? (
              <X size={25} />
            ) : (
              <Menu size={25} />
            )}
          </button>

        </div>

        {/* =================================================
            CATEGORY NAVIGATION
        ================================================= */}
        <div className="category-navbar">

          <div className="category-container" style={{ position: "relative" }}>

            <Link
              to="/"
              className="category-link active"
            >
              Home
            </Link>

            {/* INTERACTIVE CATEGORIES DROPDOWN TRIGGER */}
            <div style={{ position: "relative", display: "inline-block" }}>
              <button
                onClick={() => setCategoriesDropdown(!categoriesDropdown)}
                className="category-link category-dropdown"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  font: "inherit",
                }}
              >
                Categories
                <ChevronDown size={14} style={{ transform: categoriesDropdown ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
              </button>

              {/* LINE-BY-LINE DROPDOWN MENU */}
              {categoriesDropdown && (
                <div 
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    background: "white",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                    borderRadius: "10px",
                    marginTop: "8px",
                    minWidth: "200px",
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    padding: "8px 0",
                    border: "1px solid #f3f4f6"
                  }}
                >
                  <Link
                    to="/category/electronics"
                    onClick={() => setCategoriesDropdown(false)}
                    style={{ padding: "10px 18px", color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}
                    onMouseEnter={(e) => e.target.style.background = "#f8faff"}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                  >
                    Electronics
                  </Link>

                  <Link
                    to="/category/fashion"
                    onClick={() => setCategoriesDropdown(false)}
                    style={{ padding: "10px 18px", color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}
                    onMouseEnter={(e) => e.target.style.background = "#f8faff"}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                  >
                    Fashion
                  </Link>

                  <Link
                    to="/category/home-kitchen"
                    onClick={() => setCategoriesDropdown(false)}
                    style={{ padding: "10px 18px", color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}
                    onMouseEnter={(e) => e.target.style.background = "#f8faff"}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                  >
                    Home & Kitchen
                  </Link>

                  <Link
                    to="/category/beauty"
                    onClick={() => setCategoriesDropdown(false)}
                    style={{ padding: "10px 18px", color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}
                    onMouseEnter={(e) => e.target.style.background = "#f8faff"}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                  >
                    Beauty
                  </Link>

                  <Link
                    to="/category/sports"
                    onClick={() => setCategoriesDropdown(false)}
                    style={{ padding: "10px 18px", color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}
                    onMouseEnter={(e) => e.target.style.background = "#f8faff"}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                  >
                    Sports
                  </Link>

                  <Link
                    to="/category/accessories"
                    onClick={() => setCategoriesDropdown(false)}
                    style={{ padding: "10px 18px", color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}
                    onMouseEnter={(e) => e.target.style.background = "#f8faff"}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                  >
                    Accessories
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/category/electronics"
              className="category-link"
            >
              Electronics
            </Link>

            <Link
              to="/category/fashion"
              className="category-link"
            >
              Fashion
            </Link>

            <Link
              to="/category/home-kitchen"
              className="category-link"
            >
              Home & Kitchen
            </Link>

            <Link
              to="/category/beauty"
              className="category-link"
            >
              Beauty
            </Link>

            <Link
              to="/category/sports"
              className="category-link"
            >
              Sports
            </Link>

            <Link
              to="/category/accessories"
              className="category-link"
            >
              Accessories
            </Link>

            <Link
              to="/products?filter=deals"
              className="category-link deal-link"
            >
              <Tag size={15} />
              Deals
            </Link>

            <Link
              to="/products?filter=new"
              className="category-link"
            >
              New Arrivals
            </Link>

            <Link
              to="/products?filter=best"
              className="category-link"
            >
              Best Sellers
            </Link>

            <Link
              to="/orders"
              className="category-link"
            >
              <Truck size={15} />
              Track Order
            </Link>

          </div>

        </div>

      </header>

      {/* =================================================
          MOBILE MENU
      ================================================= */}
      {mobileMenu && (
        <div className="mobile-navbar">

          <form
            className="mobile-search"
            onSubmit={handleSearch}
          >
            <Search size={18} />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button type="submit">
              Search
            </button>
          </form>

          <Link
            to="/"
            onClick={() => setMobileMenu(false)}
          >
            Home
          </Link>

          <Link
            to="/products"
            onClick={() => setMobileMenu(false)}
          >
            Categories
          </Link>

          <Link
            to="/category/electronics"
            onClick={() => setMobileMenu(false)}
          >
            Electronics
          </Link>

          <Link
            to="/category/fashion"
            onClick={() => setMobileMenu(false)}
          >
            Fashion
          </Link>

          <Link
            to="/category/home-kitchen"
            onClick={() => setMobileMenu(false)}
          >
            Home & Kitchen
          </Link>

          <Link
            to="/category/beauty"
            onClick={() => setMobileMenu(false)}
          >
            Beauty
          </Link>

          <Link
            to="/category/sports"
            onClick={() => setMobileMenu(false)}
          >
            Sports
          </Link>

          <Link
            to="/category/accessories"
            onClick={() => setMobileMenu(false)}
          >
            Accessories
          </Link>

          <Link
            to="/cart"
            onClick={() => setMobileMenu(false)}
          >
            🛒 Cart ({cartCount})
          </Link>

          <Link
            to="/wishlist"
            onClick={() => setMobileMenu(false)}
          >
            ❤️ Wishlist ({wishlistCount})
          </Link>

          <Link
            to="/login"
            onClick={() => setMobileMenu(false)}
          >
            👤 Account
          </Link>

          <button
            className="mobile-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>
      )}
    </>
  );
}

export default Navbar;