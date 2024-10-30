import express from "express";
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";
import {
  isAdmin,
  isValidUser,
} from "../middlewares/userValidatorMiddleware.js";

const router = express.Router();

// Create a new order
router.post("/new", isValidUser, createOrder);

// Get all orders
router.get("/allOrders", isValidUser, getOrders);

// Get a single order by ID
router.get("/:id", isValidUser, getOrder);

// Update an order by ID
router.patch("/:id", isAdmin, updateOrder);

// Delete an order by ID
router.delete("/:id", isAdmin, deleteOrder);

export default router;
