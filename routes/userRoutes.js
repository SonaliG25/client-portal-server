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

const router = express.Router();

// User routes
router.post("/register", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// Authentication routes
router.post("/login", loginUser);
router.put("/reset-password/:userId", resetPassword);

export default router;
