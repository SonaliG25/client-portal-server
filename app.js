// index.mjs
import http from "http";
import io from "./socketIO/socketServer.js"; // Importing the socket server setup
import path from "path";

import express from "express";
import mongoose from "mongoose";
///Routes
import categoryRouter from "./routes/categoryRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import proposalRoutes from "./routes/proposalRoutes.js";
import proposalTemplateRoutes from "./routes/proposalTemplatesRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";

import chatRoutes from "./routes/chatRoutes.js";

import uploadRouter from "./routes/uploadRoute.js";

///---End---///
import "dotenv/config";
// import path from "path";
import cookieParser from "cookie-parser";
// import apiRouter from "./routes/api.route.js";
import cors from "cors";
import bodyParser from "body-parser";
// import jwt from "jsonwebtoken";
const app = express();
// Create an HTTP server
// const server = http.createServer(app);

// // Attach Socket.IO to the HTTP server
// io.attach(server);
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
// Serve static files from the 'uploads' directory
app.use(bodyParser.json());
app.use(express.static("public"));

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// Routes

app.use("/media", mediaRoutes);
app.use("/proposal", proposalRoutes);
app.use("/proposalTemplate", proposalTemplateRoutes);
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/invoice", invoiceRoutes);
app.use("/upload", uploadRouter);
app.use("/category", categoryRouter);
app.use("/chat", chatRoutes);
app.get("/", (req, res) => {
  res.json("Api is running successfully");
});
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
