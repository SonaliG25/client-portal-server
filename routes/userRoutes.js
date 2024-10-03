import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  resetPassword,
} from "../controllers/userController.js";
import { isValidUser } from "../middlewares/userValidatorMiddleware.js";
const router = express.Router();

// User routes
router.post("/register", createUser);
router.get("/users", isValidUser, getAllUsers);
router.get("/:id", isValidUser, getUserById);
router.put("/:id", isValidUser, updateUser);
router.delete("/:id", isValidUser, deleteUser);

// Authentication routes
router.post("/login", loginUser);
router.put("/reset-password/:userId", isValidUser, resetPassword);

export default router;
