import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/cartcontext";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartTotal,
  } = useCart();

  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h1>Your Cart is Empty 🛒</h1>

        <p>Add some amazing products first.</p>

        <Link to="/" className="hero-button">
          Shop Now
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      <h1>Your Shopping Cart</h1>

      <div className="cart-layout">

        {/* CART ITEMS */}
        <div className="cart-items">

          {cart.map((item) => (
            <div
              className="cart-item"
              key={item._id}
            >
              <img
                src={
                  item.image ||
                  item.imageUrl ||
                  "https://via.placeholder.com/150"
                }
                alt={item.name}
              />

              <div>
                <h3>{item.name}</h3>

                <p>
                  ₹
                  {Number(
                    item.price || 0
                  ).toLocaleString("en-IN")}
                </p>

                {/* QUANTITY */}
                <div className="quantity">

                  <button
                    onClick={() =>
                      decreaseQuantity(item._id)
                    }
                  >
                    −
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQuantity(item._id)
                    }
                  >
                    +
                  </button>

                </div>

                {/* REMOVE */}
                <button
                  className="remove-btn"
                  onClick={() =>
                    removeFromCart(item._id)
                  }
                >
                  Remove
                </button>

              </div>
            </div>
          ))}

        </div>

        {/* SUMMARY */}
        <div className="cart-summary">

          <h2>Order Summary</h2>

          <div>
            <span>Total</span>

            <strong>
              ₹
              {cartTotal.toLocaleString("en-IN")}
            </strong>
          </div>

          {/* CHECKOUT */}
          <button
            className="checkout-btn"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>

        </div>

      </div>
    </div>
  );
}

export default Cart;