import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import {
  isAdmin,
  isValidUser,
} from "../middlewares/userValidatorMiddleware.js";
const router = express.Router();

// Create a new product
router.post("/newProduct", isAdmin, createProduct);

// Get all products
router.get("/getProducts", isValidUser, getAllProducts);

// Get a product by ID
router.get("/:id", isValidUser, getProductById);

// Update a product by ID
router.put("/:id", isAdmin, updateProduct);

// Delete a product by ID
router.delete("/:id", isAdmin, deleteProduct);

export default router;
