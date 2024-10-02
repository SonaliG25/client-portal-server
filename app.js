// index.mjs

import express from "express";
import mongoose from "mongoose";
// import authRouter from "./routes/auth.route.js";
// import adminRouter from "./routes/admin.route.js";
// import vendorRouter from "./routes/vendor.route.js";
import userRoutes from "./routes/userRoutes.js";
// import listingRoutes from "./routes/listing.route.js";
import "dotenv/config";
// import path from "path";
import cookieParser from "cookie-parser";
// import apiRouter from "./routes/api.route.js";
import cors from "cors";
import bodyParser from "body-parser";
// import jwt from "jsonwebtoken";
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: "*", // "http://localhost:3001", // specify the allowed origin
    methods: ["GET", "POST", "PATCH", "DELETE"], // specify the allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization", "token", "Accept"], // specify the allowed headers
    credentials: true, // enable credentials (cookies, authorization headers) cross-origin
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());
// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(express.static("public"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// Routes
// app.use("/auth", authRouter);
app.use("/user", userRoutes);
// app.use("/admin", adminRouter);
// app.use("/vendor", vendorRouter);
// app.use("/api", apiRouter);
// app.use("/listing", listingRoutes);
// // DELETE Route
// app.delete("/test/category/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedCategory = await Category.findByIdAndDelete(id);

//     if (!deletedCategory) {
//       return res.status(404).json({ message: "Category not found" });
//     }

//     res.status(200).json({ message: "Category deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting category:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
app.get("/", (req, res) => {
  res.json("Api is running successfully");
});
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
