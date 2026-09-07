import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setOrder(data);
        } else {
          setError(data.message || "Failed to load order.");
        }
      } catch (err) {
        setError("Server error connecting to backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleSimulatePayment = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const response = await fetch(`http://localhost:5000/api/orders/${id}/pay`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
        body: JSON.stringify({ id: "SIMULATED_PAYPAL_ID", status: "COMPLETED", update_time: new Date().toISOString() }),
      });

      const data = await response.json();
      if (response.ok) {
        setOrder(data);
        alert("Payment successful!");
      } else {
        alert(data.message || "Payment update failed.");
      }
    } catch (err) {
      alert("Error processing payment.");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px", fontFamily: "sans-serif" }}>Loading order details...</div>;
  if (error) return <div style={{ textAlign: "center", padding: "50px", fontFamily: "sans-serif", color: "#ef4444" }}>{error}</div>;
  if (!order) return <div style={{ textAlign: "center", padding: "50px", fontFamily: "sans-serif" }}>Order not found.</div>;

  return (
    <div style={{ maxWidth: "1000px", margin: "30px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "2px solid #e5e7eb", paddingBottom: "15px" }}>
        <h1 style={{ margin: 0, color: "#1f2937" }}>Order Summary</h1>
        <button
          onClick={() => navigate("/")}
          style={{ padding: "8px 16px", backgroundColor: "#4b5563", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
        >
          Back to Home
        </button>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Shipping info */}
          <div style={{ backgroundColor: "#f9fafb", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <h3 style={{ marginTop: 0, color: "#1f2937" }}>Shipping</h3>
            <p style={{ margin: "5px 0", color: "#4b5563" }}><strong>Address:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}</p>
            <div style={{ marginTop: "10px" }}>
              <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "12px", backgroundColor: order.isDelivered ? "#d1fae5" : "#fef3c7", color: order.isDelivered ? "#065f46" : "#92400e" }}>
                {order.isDelivered ? `Delivered on ${order.deliveredAt}` : "Not Delivered"}
              </span>
            </div>
          </div>

          {/* Payment info */}
          <div style={{ backgroundColor: "#f9fafb", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <h3 style={{ marginTop: 0, color: "#1f2937" }}>Payment Method</h3>
            <p style={{ margin: "5px 0", color: "#4b5563" }}><strong>Method:</strong> {order.paymentMethod}</p>
            <div style={{ marginTop: "10px" }}>
              <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "12px", backgroundColor: order.isPaid ? "#d1fae5" : "#fee2e2", color: order.isPaid ? "#065f46" : "#991b1b" }}>
                {order.isPaid ? `Paid on ${order.paidAt}` : "Not Paid"}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div style={{ backgroundColor: "#f9fafb", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <h3 style={{ marginTop: 0, marginBottom: "15px", color: "#1f2937" }}>Order Items</h3>
            {order.orderItems.map((item, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e5e7eb", padding: "10px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img src={item.image || "/images/sample.jpg"} alt={item.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
                  <span style={{ color: "#111827", fontWeight: "500" }}>{item.name}</span>
                </div>
                <span style={{ color: "#4b5563" }}>{item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals & Actions */}
        <div style={{ backgroundColor: "#f9fafb", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb", height: "fit-content" }}>
          <h3 style={{ marginTop: 0, marginBottom: "15px", borderBottom: "1px solid #e5e7eb", paddingBottom: "10px" }}>Order Summary</h3>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#4b5563" }}>
            <span>Items:</span>
            <span>${order.itemsPrice?.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#4b5563" }}>
            <span>Shipping:</span>
            <span>${order.shippingPrice?.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", color: "#4b5563" }}>
            <span>Tax:</span>
            <span>${order.taxPrice?.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontSize: "18px", fontWeight: "bold", borderTop: "1px solid #e5e7eb", paddingTop: "10px" }}>
            <span>Total:</span>
            <span>${order.totalPrice?.toFixed(2)}</span>
          </div>

          {!order.isPaid && (
            <button
              onClick={handleSimulatePayment}
              style={{ width: "100%", padding: "12px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "16px" }}
            >
              Pay Now (Simulate)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Order() {
  return <div>Order Page</div>;
}
export default Order;
