import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // ========================================
    // USER
    // ========================================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // ========================================
    // CUSTOMER DETAILS
    // ========================================
    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      pincode: {
        type: String,
        required: true,
        trim: true,
      },
    },

    // ========================================
    // PRODUCTS
    // ========================================
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: {
          type: String,
          required: true,
          trim: true,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        image: {
          type: String,
          default: "",
        },
      },
    ],

    // ========================================
    // PAYMENT METHOD
    // ========================================
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "Card"],
      default: "COD",
    },

    // ========================================
    // TOTAL AMOUNT
    // ========================================
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // ========================================
    // ORDER STATUS
    // ========================================
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    // ========================================
    // DELIVERY
    // ========================================
    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },
  },

  // ========================================
  // TIMESTAMPS
  // ========================================
  {
    timestamps: true,
  }
);

// ========================================
// CREATE ORDER MODEL
// ========================================
const Order = mongoose.model("Order", orderSchema);

export default Order;