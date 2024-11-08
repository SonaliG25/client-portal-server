import jwt from "jsonwebtoken";

export const isAdmin = (req, res, next) => {
  // Extract the token from the request headers
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid token format" });
  }

  const token = tokenParts[1];

  try {
    // Verify the token and decode its payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    // Check if the user role is admin
    if (decoded.role !== "admin") {
      return res.status(403).json({
        message:
          "Forbidden: Only admin users are allowed to perform this action",
      });
    }

    // If user is admin, continue to the next middleware/controller
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
export const isValidUser = (req, res, next) => {
  // Extract the token from the request headers
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid token format" });
  }

  const token = tokenParts[1];

  try {
    // Verify the token and decode its payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    // Check if the user role is admin
    if (decoded.role === "admin" || decoded.role === "client") {
      req.user = { userId: decoded.userId, role: decoded.role };
      next();
    } else {
      return res.status(403).json({
        message:
          "Forbidden: Only valid users are allowed to perform this action",
      });
    }
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
