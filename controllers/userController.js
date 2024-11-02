import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendmail } from "../Helper/sendmail.js";

// Create a new user
export const createUser = async (req, res) => {
  console.log("Request Body:", req.body); // Log the incoming request body

  const {
    username,
    email,
    password,
    role,
    purchaseHistory,
    subscription,
    firstName,
    lastName,
    phone,
    addresses,
  } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      purchaseHistory,
      subscription,
      firstName,
      lastName,
      phone,
      addresses,
    });

    await newUser.save();
    sendmail(
      email,
      "Welcom to our Client-portal website",
      `Hi ${firstName} Thank for register`,
      `<p>Hi <strong>${firstName}</strong>,</p><p>Thank you for registering on our Client-portal website!</p>`
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// export const createUser = async (req, res) => {
//   console.log("Request Body:", req.body); // Log the incoming request body

//   const {
//     username,
//     email,
//     password,
//     role,
//     purchaseHistory,
//     subscription,
//     firstName,
//     lastName,
//     phone,
//     addresses,
//   } = req.body;

//   try {
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create or update user if they already exist
//     const user = await User.findOneAndUpdate(
//       { email },
//       {
//         username,
//         password: hashedPassword,
//         role,
//         purchaseHistory,
//         subscription,
//         firstName,
//         lastName,
//         phone,
//         addresses,
//       },
//       { new: true, upsert: true }
//     );

//     sendmail(
//       email,
//       "Welcome to our Client-portal website",
//       `Hi ${firstName}, thank you for registering!`,
//       `<p>Hi <strong>${firstName}</strong>,</p><p>Thank you for registering on our Client-portal website!</p>`
//     );

//     res.status(201).json({ message: "User saved successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Get all users (excluding passwords)

//for searching and pagination

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;

    // Pagination setup
    const startIndex = (page - 1) * limit;

    // Search criteria
    const searchCriteria = {
      role: "client",
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { userType: { $regex: search, $options: "i" } },
        { "subscription.length": { $regex: search, $options: "i" } },
      ],
    };

    // Fetch users based on search criteria and pagination
    const users = await User.find(searchCriteria)
      .select("-password") // Exclude password field
      .skip(startIndex) // Skip documents for pagination
      .limit(parseInt(limit)); // Limit documents per page

    // Get total count for pagination metadata
    const totalUsers = await User.countDocuments(searchCriteria);

    res.status(200).json({
      data: users,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single user by ID (excluding password)
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      purchaseHistory,
      subscription,
      firstName,
      lastName,
      phone,
      userType,
      addresses,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        purchaseHistory,
        subscription,
        firstName,
        lastName,
        phone,
        userType,
        addresses,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Cookie age
    const age = 1000 * 60 * 60 * 24 * 7;
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: age }
    );
    const userInfo = { userId: user._id, email: user.email, role: user.role };

    return res
      .status(200)
      .json({ token, userId: user._id, userInfo: userInfo });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the old password is correct
    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );
    if (!isOldPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update user's password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
