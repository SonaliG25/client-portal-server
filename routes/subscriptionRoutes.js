import express from "express";
import * as SubscriptionController from "../controllers/subscriptionController.js";
import {
  isAdmin,
  isValidUser,
} from "../middlewares/userValidatorMiddleware.js";

const router = express.Router();

// Create a new order
router.post("/new", isAdmin, SubscriptionController.createSubscription);

// Get all orders
router.get(
  "/allSubscriptions",
  isValidUser,
  SubscriptionController.getSubscriptions
);

// Get a single order by ID
router.get("/:id", isValidUser, SubscriptionController.getSubscription);
// Get a subscription user by ID for a user
router.get(
  "/subscriptionsbyuser",
  isValidUser,
  SubscriptionController.getSubscriptionsByUser
);

// Update an order by ID
router.patch("/:id", isAdmin, SubscriptionController.updateSubscription);

// Delete an order by ID
router.delete("/:id", isAdmin, SubscriptionController.deleteSubscription);

export default router;
