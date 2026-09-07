import { useEffect, useState } from "react";
import api from "../api/api";

function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // FETCH ORDERS
  // ==============================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api("/admin/orders");
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch orders error:", err);
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="admin-page">

      {/* ================= HEADER ================= */}
      <div className="admin-header">
        <p>TECHVAULT360</p>

        <h1>Admin Dashboard</h1>

        <span>Manage your store</span>
      </div>

      {/* ================= ORDERS CARD ================= */}
      <div className="admin-card">

        <h2>Recent Orders</h2>

        {/* LOADING */}
        {loading && (
          <p>Loading orders...</p>
        )}

        {/* ERROR */}
        {error && (
          <div className="error-box">
            ❌ {error}
          </div>
        )}

        {/* NO ORDERS */}
        {!loading &&
          !error &&
          orders.length === 0 && (
            <p>No orders yet.</p>
          )}

        {/* ================= ORDERS ================= */}
        {!loading &&
          !error &&
          orders.length > 0 && (

            <div className="orders-table">

              {orders.map((order) => (

                <div
                  className="order-row"
                  key={order._id}
                >

                  {/* ORDER ID */}
                  <div>
                    <small>Order ID</small>

                    <strong>
                      #{order._id.slice(-6)}
                    </strong>
                  </div>


                  {/* CUSTOMER */}
                  <div>
                    <small>Customer</small>

                    <span>
                      {order.user?.name ||
                        order.customer?.name ||
                        "Customer"}
                    </span>
                  </div>


                  {/* EMAIL */}
                  <div>
                    <small>Email</small>

                    <span>
                      {order.user?.email ||
                        order.customer?.email ||
                        "-"}
                    </span>
                  </div>


                  {/* PRODUCTS */}
                  <div>
                    <small>Products</small>

                    {order.products?.length > 0 ? (

                      order.products.map(
                        (item, index) => (

                          <div
                            key={index}
                            style={{
                              marginTop: "5px",
                            }}
                          >
                            🛍️ {item.name} ×{" "}
                            {item.quantity}
                          </div>

                        )
                      )

                    ) : (
                      <span>No products</span>
                    )}
                  </div>


                  {/* TOTAL */}
                  <div>
                    <small>Total</small>

                    <strong
                      style={{
                        color: "#2563eb",
                        fontSize: "16px",
                      }}
                    >
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>


                  {/* STATUS */}
                  <div>
                    <small>Status</small>

                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "5px",
                        padding: "5px 10px",
                        borderRadius: "20px",
                        background:
                          order.status ===
                          "Delivered"
                            ? "#dcfce7"
                            : order.status ===
                              "Cancelled"
                            ? "#fee2e2"
                            : "#fef3c7",
                        color:
                          order.status ===
                          "Delivered"
                            ? "#166534"
                            : order.status ===
                              "Cancelled"
                            ? "#991b1b"
                            : "#92400e",
                        fontWeight: "600",
                        fontSize: "13px",
                      }}
                    >
                      {order.status ||
                        "Pending"}
                    </span>
                  </div>


                  {/* DATE */}
                  <div>
                    <small>Date</small>

                    <span>
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </span>
                  </div>

                </div>

              ))}

            </div>
          )}

      </div>
    </div>
  );
}

export default Admin;