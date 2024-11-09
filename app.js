// index.mjs
import http from "http";
import { Server } from "socket.io" // Importing the socket server setup
import path from "path";
import jwt from "jsonwebtoken";
import express from "express";
import mongoose from "mongoose";
import Chat from "./models/chatModel.js";
///Routes
import categoryRouter from "./routes/categoryRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import proposalRoutes from "./routes/proposalRoutes.js";
import proposalTemplateRoutes from "./routes/proposalTemplatesRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import ticketRouter from "./routes/ticketRoutes.js";
// import uploadImageRouter from "./routes/uploadImageRoute.js";
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
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    rigin: "*", // Set to "*" or specific origin (e.g., "http://localhost:3001") for security
    methods: ["GET", "POST"],
    credentials: true, // Enable credentials if necessary
  },
})

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
io.use((socket, next) => {
  console.log(socket.handshake.headers.token);
  
  const token = socket.handshake.headers.token; // Extract token from query

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    console.log("Decoded");
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Validate token
    console.log("Decoded ===",decoded);
    
    socket.user = decoded; // Attach user data to socket instance for later use
    next(); // Allow connection
  } catch (error) {
    next(new Error("Authentication error: Invalid token",token));
  }
})


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  
  // Join a chat room
  socket.on("joinRoom", ({ userId, receiverId }) => {
    const room = [userId, receiverId].sort().join("_");
    socket.join(room);
    console.log(`User joined room ${room}`);
  });

  

  // Handle sending a message
  socket.on("sendMessage", async(data) => {
    const room = [data.sender, data.receiver].sort().join("_");
    
    
    io.to(room).emit("receiveMessage", data); // Broadcast the message to the room
    console.log("RoomData ==>",data);

    try {
      const newMessage = new Chat({
        sender: data.sender,
        receiver: data.receiver,
        message: data.message,
         room: room,
         file:data.file,
        createdAt: new Date()
      });
      
      await newMessage.save();
      
      io.to(data.receiver).emit("newMessageNotification", {
        sender: data.sender,
        message: data.message,
      });
      console.log("Message saved to database:", newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
})

app.use("/media", mediaRoutes);
app.use("/proposal", proposalRoutes);
app.use("/proposalTemplate", proposalTemplateRoutes);
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/invoice", invoiceRoutes);
app.use("/upload", uploadRouter);
app.use("/ticket", ticketRouter);
app.use("/category", categoryRouter);
app.use("/chat", chatRoutes);
app.get("/", (req, res) => {
  res.json("Api is running successfully");
});
// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
