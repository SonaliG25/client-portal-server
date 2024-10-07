import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { isAdmin } from "../middlewares/userValidatorMiddleware.js";
const router = express.Router();

// Create a new product
router.post("/newProduct", createProduct);

// Get all products
router.get("/allProducts", getAllProducts);

// Get a product by ID
router.get("/:id", getProductById);

// Update a product by ID
router.put("/:id", updateProduct);

// Delete a product by ID
router.delete("/:id", deleteProduct);

export default router;
