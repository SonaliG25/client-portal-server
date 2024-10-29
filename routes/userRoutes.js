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
import {
  isValidUser,
  isAdmin,
} from "../middlewares/userValidatorMiddleware.js";
const router = express.Router();
import User from "../models/userModel.js";
// User routes
router.post("/register", createUser);
router.get("/users", isValidUser, getAllUsers);
router.get("/:id", isValidUser, getUserById);
router.patch("/:id", isValidUser, updateUser);
router.delete("/:id", isValidUser, deleteUser);

// Authentication routes
router.post("/login", loginUser);
router.patch("/reset-password/:userId", isValidUser, resetPassword);

// GET /api/users?search=<searchTerm>
router.get("/searchuser", isAdmin, async (req, res) => {
  const { search } = req.query;

  // Perform search based on the query
  try {
    const users = await User.find({
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
