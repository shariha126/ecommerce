import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchOrders = async () => {
      try {
        const data = await api("/orders"); 
        console.log("Raw Order Data from Backend:", data); // Check F12 Console to see exact keys!
        setOrders(data);
      } catch (err) {
        setOrderError(err.message || "Failed to load orders");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Flexible calculation that checks multiple possible keys for items and totals
  const getOrderTotal = (order) => {
    const backendTotal = order.totalPrice || order.total || order.totalAmount || order.amount;
    if (backendTotal !== undefined && backendTotal !== null && backendTotal > 0) {
      return backendTotal;
    }

    const itemsArray = order.orderItems || order.items || order.products || [];
    if (itemsArray.length > 0) {
      return itemsArray.reduce((sum, item) => {
        const price = Number(item.price || item.cost || item.productPrice || 0);
        const qty = Number(item.qty || item.quantity || 1);
        return sum + (price * qty);
      }, 0);
    }

    return 0;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8faff", padding: "40px", fontFamily: "sans-serif" }}>
      {/* Top Navbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", padding: "20px 30px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <h2 style={{ margin: 0, color: "#312e81" }}>TechVault<span style={{ color: "#db2777" }}>360</span> Dashboard</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span>Welcome, <strong>{user?.name || "Customer"}</strong></span>
          <button 
            onClick={handleLogout}
            style={{ padding: "10px 18px", background: "#ef4444", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ marginTop: "30px", display: "grid", gap: "20px" }}>
        
        {/* ORDERS SECTION */}
        <div style={{ background: "white", padding: "25px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <h3 style={{ color: "#4f46e5", marginTop: 0 }}>📦 Orders for {user?.name || "Customer"}</h3>

          {loadingOrders ? (
            <p style={{ color: "#6b7280" }}>Loading your orders...</p>
          ) : orderError ? (
            <p style={{ color: "#ef4444" }}>{orderError}</p>
          ) : orders.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No orders found. Complete a checkout to see your orders here!</p>
          ) : (
            <div style={{ display: "grid", gap: "15px", marginTop: "15px" }}>
              {orders.map((order) => {
                const finalTotal = getOrderTotal(order);
                // Flexible check for items using orderItems, items, or products
                const itemsArray = order.orderItems || order.items || order.products || [];

                return (
                  <div key={order._id || order.id} style={{ padding: "18px", border: "1px solid #e5e7eb", borderRadius: "12px", background: "#ffffff" }}>
                    
                    {/* Customer Name & Order Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid #f3f4f6", paddingBottom: "8px" }}>
                      <div>
                        <strong style={{ color: "#111827", fontSize: "15px" }}>
                          Customer: {order.user?.name || user?.name || "Customer"}
                        </strong>
                        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                          Order ID: {order._id || order.id}
                        </div>
                      </div>
                      <span style={{ padding: "5px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold", background: order.isPaid ? "#d1fae5" : "#fee2e2", color: order.isPaid ? "#065f46" : "#991b1b" }}>
                        {order.isPaid ? "Paid / Processing" : "Pending Payment"}
                      </span>
                    </div>

                    {/* Product Names, Quantities & Exact Item Prices */}
                    <div style={{ display: "grid", gap: "8px", marginBottom: "12px" }}>
                      <div style={{ fontSize: "11px", fontWeight: "bold", color: "#9ca3af", letterSpacing: "0.5px" }}>PRODUCTS PURCHASED</div>
                      {itemsArray.length > 0 ? (
                        itemsArray.map((item, idx) => (
                          <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", color: "#374151", background: "#f9fafb", padding: "8px 12px", borderRadius: "8px" }}>
                            <div>
                              <span style={{ fontWeight: "500" }}>{item.name || item.title || item.productName || "Product"}</span>
                              <span style={{ color: "#6b7280", fontSize: "12px", marginLeft: "8px" }}>(Qty: {item.qty || item.quantity || 1})</span>
                            </div>
                            <span style={{ fontWeight: "600", color: "#111827" }}>
                              ₹{item.price !== undefined ? item.price : (item.cost || item.productPrice || "0")}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span style={{ fontSize: "13px", color: "#ef4444" }}>No item details available in database for this order</span>
                      )}
                    </div>

                    {/* Total Cost in Rupees */}
                    <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #f3f4f6", paddingTop: "10px", fontSize: "15px", fontWeight: "bold", color: "#111827" }}>
                      Total Cost: ₹{finalTotal}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}