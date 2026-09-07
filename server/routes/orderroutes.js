import express from "express";

import {
  protect,
  admin,
} from "../middleware/adminmiddleware.js";

import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
} from "../controllers/ordercontroller.js";

const router = express.Router();

// ========================================
// CREATE ORDER + GET MY ORDERS
// POST /api/orders
// GET  /api/orders
// ========================================
router
  .route("/")
  .post(protect, addOrderItems)
  .get(protect, getMyOrders);

// ========================================
// GET ORDER BY ID
// GET /api/orders/:id
// ========================================
router
  .route("/:id")
  .get(protect, getOrderById);

// ========================================
// UPDATE ORDER TO CONFIRMED
// PUT /api/orders/:id/pay
// ========================================
router
  .route("/:id/pay")
  .put(protect, updateOrderToPaid);

// ========================================
// UPDATE ORDER TO DELIVERED
// PUT /api/orders/:id/deliver
// ========================================
router
  .route("/:id/deliver")
  .put(
    protect,
    admin,
    updateOrderToDelivered
  );

export default router;