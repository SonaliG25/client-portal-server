import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { sendmail } from "../Helper/sendmail.js";

// Create a new user
export const createUser = async (req, res) => {
  console.log("Request Body:", req.body); // Log the incoming request body

  const {
    email,
    password,
    role,
    name,
    phone,
    userType,
    businessDetails,
    timeZone,
    preferredContactMethod,
    notes,
    paymentStatus,
    allowLogin,
    activeAccount,
    bannedAccount,
    accountManagers,
    address,
    purchaseHistory,
    subscription,
  } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    const username = email.split("@")[0];

    // Create new user
    const newUser = new User({
      username: username,
      email,
      password: hashedPassword,
      role,
      name,
      phone,
      userType,
      businessDetails,
      timeZone,
      preferredContactMethod,
      notes,
      paymentStatus,
      allowLogin,
      activeAccount,
      bannedAccount,
      accountManagers,
      address,
      purchaseHistory,
      subscription,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// userController.js

export const getRoleClients = async (req, res) => {
  try {
    // Only find users where role is 'client'
    const users = await User.find({ role: "client" });
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve users", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;

    // Pagination setup
    const startIndex = (page - 1) * limit;

    // Search criteria
    const searchCriteria = {
      role: "client",
      $or: [
        { "address.state": { $regex: search, $options: "i" } },
        { "address.country": { $regex: search, $options: "i" } },
        { "address.city": { $regex: search, $options: "i" } },
        { "businessDetails.companyType": { $regex: search, $options: "i" } },
        { "businessDetails.clientName": { $regex: search, $options: "i" } },
        { "address.street1": { $regex: search, $options: "i" } },
        { "address.street2": { $regex: search, $options: "i" } },
        { timeZone: { $regex: search, $options: "i" } },
        { preferredContactMethod: { $regex: search, $options: "i" } },
      ],
    };

    // Fetch users based on search criteria, pagination, and sort order
    const users = await User.find(searchCriteria)
      .select("-password") // Exclude password field
      .sort({ firstName: 1 }) // Sort by lastName, then by firstName
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

// export const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       purchaseHistory,
//       subscription,
//       firstName,
//       lastName,
//       phone,
//       userType,
//       addresses,
//     } = req.body;

//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       {
//         purchaseHistory,
//         subscription,
//         firstName,
//         lastName,
//         phone,
//         userType,
//         addresses,
//       },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// Delete a user by ID

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      password,
      name,
      phone,
      userType,
      businessDetails,
      timeZone,
      preferredContactMethod,
      notes,
      paymentStatus,
      allowLogin,
      activeAccount,
      bannedAccount,
      accountManagers,
      addresses,
      purchaseHistory,
      subscription,
    } = req.body;

    // Build an object with the updated fields
    const updateData = {
      password,
      name,
      phone,
      userType,
      businessDetails,
      timeZone,
      preferredContactMethod,
      notes,
      paymentStatus,
      allowLogin,
      activeAccount,
      bannedAccount,
      accountManagers,
      addresses,
      purchaseHistory,
      subscription,
    };

    // Remove any fields with undefined values
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    // Check if password is being updated and hash it
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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
