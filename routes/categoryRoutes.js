// routes/categoryRoutes.js
import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import {
  isAdmin,
  isValidUser,
} from "../middlewares/userValidatorMiddleware.js";
const router = express.Router();

router.post("/new", isAdmin, createCategory); // Create category
router.get("/allCategory", isValidUser, getCategories); // Get all categories
router.get("/:id", isValidUser, getCategoryById); // Get category by ID
router.patch("/:id", isAdmin, updateCategory); // Update category
router.delete("/:id", isAdmin, deleteCategory); // Delete category

export default router;
