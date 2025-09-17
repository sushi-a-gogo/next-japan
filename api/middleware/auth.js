import { verifyAccessToken } from "../utils/jwt.js";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // { userId, email }
    next();
  } catch (err) {
    console.error("Token validation failed: " + err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
