import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cartcontext";
import api from "../api/api";

function Checkout() {
  const navigate = useNavigate();

  const {
    cart,
    cartTotal,
    removeFromCart,
  } = useCart();

  // ==============================
  // CUSTOMER DETAILS
  // ==============================
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // ==============================
  // ADDRESS
  // ==============================
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  // ==============================
  // PAYMENT
  // ==============================
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // ==============================
  // OTHER
  // ==============================
  const [saveDetails, setSaveDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  

  // ==============================
  // LOAD SAVED CHECKOUT DETAILS
  // ==============================
  useEffect(() => {
    const saved = localStorage.getItem("checkoutDetails");

    if (saved) {
      try {
        const details = JSON.parse(saved);

        setName(details.name || "");
        setEmail(details.email || "");
        setPhone(details.phone || "");
        setAddress(details.address || "");
        setCity(details.city || "");
        setState(details.state || "");
        setPincode(details.pincode || "");

        setSaveDetails(true);
      } catch (err) {
        console.error("Error loading saved details:", err);
      }
    }
  }, []);

  // ==============================
  // EMPTY CART
  // ==============================
  if (!cart || cart.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>🛒</div>

          <h1>Your Cart is Empty</h1>

          <p style={styles.emptyText}>
            Add some products before checking out.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            style={styles.backButton}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // ==============================
  // PLACE ORDER
  // ==============================
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // ------------------------------
      // SAVE / REMOVE CUSTOMER DETAILS
      // ------------------------------
      if (saveDetails) {
        const details = {
          name,
          email,
          phone,
          address,
          city,
          state,
          pincode,
        };

        localStorage.setItem(
          "checkoutDetails",
          JSON.stringify(details)
        );
      } else {
        localStorage.removeItem("checkoutDetails");
      }

      // ------------------------------
      // PREPARE PRODUCTS
      // ------------------------------
      const products = cart.map((item) => ({
        product: item._id,
        name: item.name,
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        image: item.image || item.imageUrl || "",
      }));

      // ------------------------------
      // PREPARE ORDER DATA
      // ------------------------------
      const orderData = {
        customer: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
        },

        products,

        totalAmount: Number(cartTotal || 0),

        paymentMethod,
      };

      console.log("Sending Order:", orderData);

      // ------------------------------
      // SEND ORDER TO BACKEND
      // POST /api/orders
      // ------------------------------
      const data = await api("/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      });

      console.log("Order Created:", data);

      // ------------------------------
      // CHECK ORDER ID
      // ------------------------------
      if (!data || !data._id) {
        throw new Error(
          "Order was created but no order ID was returned."
        );
      }

      // ------------------------------
      // CLEAR CART
      // ------------------------------
      cart.forEach((item) => {
        removeFromCart(item._id);
      });

      // ------------------------------
      // GO TO ORDER SUCCESS PAGE
      // ------------------------------
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      console.error("Place order error:", err);

      setError(
        err.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // UI
  // ==============================
  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* ==========================
            HEADER
        ========================== */}
        <div style={styles.header}>
          <div>
            <p style={styles.brand}>
              TECHVAULT360
            </p>

            <h1 style={styles.title}>
              Checkout
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            style={styles.backButton}
          >
            ← Back to Cart
          </button>
        </div>

        {/* ==========================
            ERROR
        ========================== */}
        {error && (
          <div style={styles.error}>
            ❌ {error}
          </div>
        )}

        {/* ==========================
            FORM
        ========================== */}
        <form
          onSubmit={handlePlaceOrder}
          style={styles.form}
        >

          {/* ========================
              LEFT COLUMN
          ======================== */}
          <div style={styles.leftColumn}>

            {/* CUSTOMER DETAILS */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>
                Customer Details
              </h2>

              {/* NAME */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your full name"
                  required
                  style={styles.input}
                />
              </div>

              {/* EMAIL */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  required
                  style={styles.input}
                />
              </div>

              {/* PHONE */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="Enter your phone number"
                  required
                  style={styles.input}
                />
              </div>

              {/* SAVE DETAILS */}
              <label style={styles.saveDetails}>
                <input
                  type="checkbox"
                  checked={saveDetails}
                  onChange={(e) =>
                    setSaveDetails(e.target.checked)
                  }
                  style={styles.checkbox}
                />

                <span>
                  Save my details for next time
                </span>
              </label>
            </div>

            {/* ========================
                DELIVERY ADDRESS
            ======================== */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>
                Delivery Address
              </h2>

              {/* ADDRESS */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  House / Street / Area
                </label>

                <textarea
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  placeholder="Enter your complete address"
                  required
                  style={styles.textarea}
                />
              </div>

              {/* CITY + STATE */}
              <div style={styles.row}>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    City
                  </label>

                  <input
                    type="text"
                    value={city}
                    onChange={(e) =>
                      setCity(e.target.value)
                    }
                    placeholder="City"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    State
                  </label>

                  <input
                    type="text"
                    value={state}
                    onChange={(e) =>
                      setState(e.target.value)
                    }
                    placeholder="State"
                    required
                    style={styles.input}
                  />
                </div>

              </div>

              {/* PINCODE */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Pincode
                </label>

                <input
                  type="text"
                  value={pincode}
                  onChange={(e) =>
                    setPincode(e.target.value)
                  }
                  placeholder="Enter pincode"
                  required
                  style={styles.input}
                />
              </div>
            </div>

            {/* ========================
                PAYMENT
            ======================== */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>
                Payment Method
              </h2>

              <div style={styles.paymentOptions}>

                {/* COD */}
                <label style={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={
                      paymentMethod === "COD"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                    style={styles.radio}
                  />

                  <div>
                    <strong>
                      💵 Cash on Delivery
                    </strong>

                    <p style={styles.paymentText}>
                      Pay when your order arrives
                    </p>
                  </div>
                </label>

                {/* UPI */}
                <label style={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={
                      paymentMethod === "UPI"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                    style={styles.radio}
                  />

                  <div>
                    <strong>
                      📱 UPI
                    </strong>

                    <p style={styles.paymentText}>
                      Pay using UPI
                    </p>
                  </div>
                </label>

                {/* CARD */}
                <label style={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Card"
                    checked={
                      paymentMethod === "Card"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                    style={styles.radio}
                  />

                  <div>
                    <strong>
                      💳 Credit / Debit Card
                    </strong>

                    <p style={styles.paymentText}>
                      Pay securely with your card
                    </p>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* ==========================
              RIGHT COLUMN
          ========================== */}
          <div style={styles.summary}>

            <h2 style={styles.summaryTitle}>
              Order Summary
            </h2>

            {/* PRODUCTS */}
            <div style={styles.productList}>

              {cart.map((item) => (
                <div
                  key={item._id}
                  style={styles.summaryProduct}
                >
                  <div style={styles.productInfo}>
                    <span style={styles.productName}>
                      {item.name}
                    </span>

                    <span style={styles.productQuantity}>
                      × {item.quantity || 1}
                    </span>
                  </div>

                  <strong>
                    ₹
                    {(
                      Number(item.price || 0) *
                      Number(item.quantity || 1)
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>
              ))}

            </div>

            {/* SUBTOTAL */}
            <div style={styles.summarySection}>

              <div style={styles.summaryRow}>
                <span>
                  Subtotal
                </span>

                <span>
                  ₹
                  {Number(
                    cartTotal || 0
                  ).toLocaleString("en-IN")}
                </span>
              </div>

              {/* SHIPPING */}
              <div style={styles.summaryRow}>
                <span>
                  Shipping
                </span>

                <span style={styles.free}>
                  FREE
                </span>
              </div>

            </div>

            {/* TOTAL */}
            <div style={styles.totalRow}>
              <span>
                Total
              </span>

              <span style={styles.totalPrice}>
                ₹
                {Number(
                  cartTotal || 0
                ).toLocaleString("en-IN")}
              </span>
            </div>

            {/* PLACE ORDER */}
            <button
              type="submit"
              disabled={loading}
              style={
                loading
                  ? styles.disabledButton
                  : styles.placeOrderButton
              }
            >
              {loading
                ? "Placing Order..."
                : "Place Order →"}
            </button>

            <p style={styles.secureText}>
              🔒 Secure Checkout
            </p>

          </div>

        </form>
      </div>
    </div>
  );
}

// ======================================================
// STYLES
// ======================================================

// ======================================================
// STYLES
// ======================================================

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "40px 20px",
    fontFamily: "Arial, Helvetica, sans-serif",
    boxSizing: "border-box",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  emptyContainer: {
    maxWidth: "500px",
    margin: "80px auto",
    background: "#ffffff",
    padding: "50px 30px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  emptyIcon: {
    fontSize: "55px",
    marginBottom: "15px",
  },

  emptyText: {
    color: "#6b7280",
    marginBottom: "25px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "18px",
    borderBottom: "1px solid #e5e7eb",
  },

  brand: {
    margin: 0,
    color: "#2563eb",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "2px",
  },

  title: {
    margin: "5px 0 0",
    fontSize: "34px",
    fontWeight: "800",
    color: "#111827",
  },

  backButton: {
    padding: "11px 18px",
    background: "#374151",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "20px",
    border: "1px solid #fecaca",
  },

  form: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)",
    gap: "28px",
    alignItems: "start",
  },

  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  card: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "18px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
  },

  cardTitle: {
    marginTop: 0,
    marginBottom: "20px",
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "15px",
  },

  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
    background: "#ffffff",
    color: "#111827",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: "90px",
    padding: "13px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "15px",
    resize: "vertical",
    outline: "none",
    background: "#ffffff",
    color: "#111827",
    fontFamily: "Arial, Helvetica, sans-serif",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },

  saveDetails: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "5px",
    color: "#374151",
    fontSize: "14px",
    cursor: "pointer",
  },

  checkbox: {
    width: "17px",
    height: "17px",
    cursor: "pointer",
    accentColor: "#2563eb",
  },

  paymentOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  paymentOption: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    background: "#ffffff",
    cursor: "pointer",
    color: "#111827",
    fontSize: "15px",
  },

  radio: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: "#2563eb",
  },

  paymentText: {
    margin: "4px 0 0",
    fontSize: "13px",
    color: "#6b7280",
  },

  summary: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "18px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
    position: "sticky",
    top: "20px",
  },

  summaryTitle: {
    marginTop: 0,
    marginBottom: "20px",
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
    paddingBottom: "15px",
    borderBottom: "1px solid #e5e7eb",
  },

  productList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxHeight: "250px",
    overflowY: "auto",
    marginBottom: "15px",
  },

  summaryProduct: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    color: "#374151",
  },

  productInfo: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },

  productName: {
    fontWeight: "600",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  productQuantity: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "3px",
  },

  summarySection: {
    borderTop: "1px solid #e5e7eb",
    paddingTop: "15px",
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
    color: "#4b5563",
    fontSize: "15px",
  },

  free: {
    color: "#16a34a",
    fontWeight: "700",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
    paddingTop: "18px",
    borderTop: "1px solid #e5e7eb",
    fontSize: "20px",
    fontWeight: "800",
    color: "#111827",
  },

  totalPrice: {
    color: "#2563eb",
    fontSize: "22px",
  },

  placeOrderButton: {
    width: "100%",
    marginTop: "25px",
    padding: "15px",
    border: "none",
    borderRadius: "12px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  },

  disabledButton: {
    width: "100%",
    marginTop: "25px",
    padding: "15px",
    border: "none",
    borderRadius: "12px",
    background: "#9ca3af",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "not-allowed",
  },

  secureText: {
    textAlign: "center",
    marginTop: "15px",
    marginBottom: 0,
    color: "#6b7280",
    fontSize: "12px",
  },
};

export default Checkout;