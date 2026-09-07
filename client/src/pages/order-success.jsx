import React from "react";
import { useNavigate, useParams } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();
  const { id } = useParams(); // Grabs the order ID from the URL if available

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", textAlign: "center", padding: "20px" }}>
      <div style={{ background: "#f8f9fa", padding: "40px", borderRadius: "12px", border: "1px solid #dee2e6", maxWidth: "400px", width: "100%" }}>
        <h2 style={{ color: "#28a745", marginBottom: "15px" }}>Order Placed Successfully! 🎉</h2>
        <p style={{ color: "#6c757d", marginBottom: "20px" }}>
          Thank you for your purchase. Your order has been placed and is being processed.
        </p>
        
        {id && (
          <p style={{ fontWeight: "bold", marginBottom: "20px" }}>
            Order ID: <span style={{ color: "#007bff" }}>{id}</span>
          </p>
        )}

        <button 
          onClick={() => navigate("/")} 
          style={{ width: "100%", padding: "10px", background: "#007BFF", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px" }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;