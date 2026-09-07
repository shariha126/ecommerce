import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/layout/navbar";
import Wishlist from "./pages/wishlist";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Cart from "./pages/cart";
import Admin from "./pages/Admin";
import Checkout from "./pages/checkout";
import Product from "./pages/product";
import ProductDetails from "./pages/productdetails.jsx";
import OrderSuccess from "./pages/order-success";
import ProductScreen from "./screens/productsscreen";
import Dashboard from "./pages/dashboard.jsx";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/cartcontext";
import Category from "./pages/category";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>

          {/* NAVBAR */}
          <Navbar />

          <Routes>

            <Route path="/wishlist" element={<Wishlist />} />

            {/* =========================
                HOME
            ========================== */}
            <Route
              path="/"
              element={<Home />}
            />

            {/* =========================
                AUTH
            ========================== */}
            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            {/* =========================
                PRODUCTS
            ========================== */}
            <Route
              path="/products"
              element={<ProductScreen />}
            />

            <Route
  path="/category/:category"
  element={<Category />}
/>

            <Route
              path="/product/:id"
              element={<ProductDetails />}
            />

            {/* =========================
                CART
            ========================== */}
            <Route
              path="/cart"
              element={<Cart />}
            />

            {/* =========================
                CHECKOUT
            ========================== */}
            <Route
              path="/checkout"
              element={<Checkout />}
            />

            {/* =========================
                ADMIN
            ========================== */}
            <Route
              path="/admin"
              element={<Admin />}
            />

            {/* =========================
                ORDER SUCCESS
            ========================== */}

            {/* Standard URL */}
            <Route
              path="/order-success/:id"
              element={<OrderSuccess />}
            />

            {/* Supports your current checkout navigation */}
            <Route
              path="/ordersuccess/:id"
              element={<OrderSuccess />}
            />

            <Route 
            path="/dashboard" element={<Dashboard />}
/>
          </Routes>

        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;