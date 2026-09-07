import express from "express";

import { protect, admin } from "../middleware/adminmiddleware.js";

import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";

const router = express.Router();

/* =====================================================
   GET ALL ORDERS
   GET /api/admin/orders
===================================================== */

router.get("/orders", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    console.log("========== ADMIN ORDERS ==========");

    orders.forEach((order) => {
      console.log({
        id: order._id,
        customer: order.customer,
        products: order.products,
        totalAmount: order.totalAmount,
        status: order.status,
      });
    });

    res.status(200).json(orders);

  } catch (error) {
    console.error("Error fetching admin orders:", error);

    res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
});


/* =====================================================
   UPDATE ORDER STATUS
   PUT /api/admin/orders/:id/status
===================================================== */

router.put(
  "/orders/:id/status",
  protect,
  admin,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "Pending",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid order status",
          allowedStatuses,
        });
      }

      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      order.status = status;

      const updatedOrder = await order.save();

      res.status(200).json(updatedOrder);

    } catch (error) {
      console.error("Update order status error:", error);

      res.status(500).json({
        message: "Failed to update order status",
        error: error.message,
      });
    }
  }
);


/* =====================================================
   MARK ORDER AS DELIVERED
   PUT /api/admin/orders/:id/deliver
===================================================== */

router.put(
  "/orders/:id/deliver",
  protect,
  admin,
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      order.status = "Delivered";

      const updatedOrder = await order.save();

      res.status(200).json(updatedOrder);

    } catch (error) {
      console.error("Deliver order error:", error);

      res.status(500).json({
        message: "Failed to deliver order",
        error: error.message,
      });
    }
  }
);


/* =====================================================
   CREATE PRODUCT
   POST /api/admin/products
===================================================== */

router.post(
  "/products",
  protect,
  admin,
  async (req, res) => {
    try {
      const {
        name,
        price,
        image,
        category,
        countInStock,
        description,
      } = req.body;

      if (!name || price === undefined) {
        return res.status(400).json({
          message: "Product name and price are required",
        });
      }

      const product = new Product({
        name,
        price: Number(price),
        image: image || "/images/sample.jpg",
        category,
        countInStock: Number(countInStock || 0),
        description,
      });

      const createdProduct = await product.save();

      res.status(201).json(createdProduct);

    } catch (error) {
      console.error("Create product error:", error);

      res.status(500).json({
        message: "Failed to create product",
        error: error.message,
      });
    }
  }
);


/* =====================================================
   DELETE PRODUCT
   DELETE /api/admin/products/:id
===================================================== */

router.delete(
  "/products/:id",
  protect,
  admin,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      await product.deleteOne();

      res.status(200).json({
        message: "Product deleted successfully",
      });

    } catch (error) {
      console.error("Delete product error:", error);

      res.status(500).json({
        message: "Failed to delete product",
        error: error.message,
      });
    }
  }
);


/* =====================================================
   UPDATE PRODUCT
   PUT /api/admin/products/:id
===================================================== */

router.put(
  "/products/:id",
  protect,
  admin,
  async (req, res) => {
    try {
      const {
        name,
        price,
        image,
        category,
        countInStock,
        description,
      } = req.body;

      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (name !== undefined) {
        product.name = name;
      }

      if (price !== undefined) {
        product.price = Number(price);
      }

      if (image !== undefined) {
        product.image = image;
      }

      if (category !== undefined) {
        product.category = category;
      }

      if (countInStock !== undefined) {
        product.countInStock = Number(countInStock);
      }

      if (description !== undefined) {
        product.description = description;
      }

      const updatedProduct = await product.save();

      res.status(200).json(updatedProduct);

    } catch (error) {
      console.error("Update product error:", error);

      res.status(500).json({
        message: "Failed to update product",
        error: error.message,
      });
    }
  }
);


/* =====================================================
   DASHBOARD STATS
   GET /api/admin/stats
===================================================== */

router.get(
  "/stats",
  protect,
  admin,
  async (req, res) => {
    try {
      const totalOrders = await Order.countDocuments();

      const totalProducts = await Product.countDocuments();

      const totalUsers = await User.countDocuments();

      const orders = await Order.find({});

      const totalRevenue = orders.reduce(
        (total, order) => {
          return total + Number(
            order.totalAmount || 0
          );
        },
        0
      );

      res.status(200).json({
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue,
      });

    } catch (error) {
      console.error("Stats error:", error);

      res.status(500).json({
        message: "Failed to fetch stats",
        error: error.message,
      });
    }
  }
);


/* =====================================================
   GET ALL USERS
   GET /api/admin/users
===================================================== */

router.get(
  "/users",
  protect,
  admin,
  async (req, res) => {
    try {
      const users = await User.find({})
        .select("-password")
        .sort({ createdAt: -1 });

      res.status(200).json(users);

    } catch (error) {
      console.error("Users fetch error:", error);

      res.status(500).json({
        message: "Failed to fetch users",
        error: error.message,
      });
    }
  }
);


/* =====================================================
   DELETE USER
   DELETE /api/admin/users/:id
===================================================== */

router.delete(
  "/users/:id",
  protect,
  admin,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      await user.deleteOne();

      res.status(200).json({
        message: "User removed successfully",
      });

    } catch (error) {
      console.error("Delete user error:", error);

      res.status(500).json({
        message: "Failed to delete user",
        error: error.message,
      });
    }
  }
);


export default router;