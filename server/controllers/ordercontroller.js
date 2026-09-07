import Order from "../models/order.js";

// ======================================================
// CREATE ORDER
// POST /api/orders
// ======================================================
export const addOrderItems = async (req, res) => {
  try {
    console.log("================================");
    console.log("CREATE ORDER REQUEST");
    console.log("Body:", req.body);
    console.log("User:", req.user);
    console.log("================================");

    const { customer, products, totalAmount } = req.body;

    // Check customer
    if (!customer) {
      return res.status(400).json({
        message: "Customer details are required",
      });
    }

    // Check required customer fields
    if (
      !customer.name ||
      !customer.email ||
      !customer.phone ||
      !customer.address ||
      !customer.city ||
      !customer.state ||
      !customer.pincode
    ) {
      return res.status(400).json({
        message: "Please fill all customer and address details",
      });
    }

    // Check products
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "No products in order",
      });
    }

    // Check total
    if (
      totalAmount === undefined ||
      Number(totalAmount) <= 0
    ) {
      return res.status(400).json({
        message: "Invalid total amount",
      });
    }

    // Prepare products
    const orderProducts = products.map((item) => ({
      product: item.product,
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity || 1),
      image: item.image || "",
    }));

    // Create order
    const newOrder = new Order({
      user: req.user?.id || null,

      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
      },

      products: orderProducts,

      totalAmount: Number(totalAmount),

      status: "Pending",
    });

    // Save to MongoDB
    const savedOrder = await newOrder.save();

    console.log("Order created successfully:", savedOrder._id);

    return res.status(201).json(savedOrder);
  } catch (error) {
    console.error("================================");
    console.error("CREATE ORDER ERROR:");
    console.error(error);
    console.error("================================");

    return res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};


// ======================================================
// GET ORDER BY ID
// GET /api/orders/:id
// ======================================================
export const getOrderById = async (req, res) => {
  try {
    const foundOrder = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate(
        "products.product",
        "name price image"
      );

    if (!foundOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json(foundOrder);
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};


// ======================================================
// UPDATE ORDER TO PAID / CONFIRMED
// PUT /api/orders/:id/pay
// ======================================================
export const updateOrderToPaid = async (req, res) => {
  try {
    const foundOrder = await Order.findById(
      req.params.id
    );

    if (!foundOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    foundOrder.status = "Confirmed";

    const updatedOrder = await foundOrder.save();

    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Payment update error:", error);

    return res.status(500).json({
      message: "Failed to update payment",
      error: error.message,
    });
  }
};


// ======================================================
// UPDATE ORDER TO DELIVERED
// PUT /api/orders/:id/deliver
// ======================================================
export const updateOrderToDelivered = async (req, res) => {
  try {
    const foundOrder = await Order.findById(
      req.params.id
    );

    if (!foundOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    foundOrder.status = "Delivered";

    const updatedOrder = await foundOrder.save();

    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Delivery update error:", error);

    return res.status(500).json({
      message: "Failed to update delivery status",
      error: error.message,
    });
  }
};


// ======================================================
// GET MY ORDERS
// GET /api/orders
// ======================================================
export const getMyOrders = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "User authentication required",
      });
    }

    const orders = await Order.find({
      user: req.user.id,
    })
      .populate(
        "products.product",
        "name price image"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Get my orders error:", error);

    return res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};