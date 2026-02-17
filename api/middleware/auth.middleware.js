import { verifyAccessToken } from "../utils/jwt.js";

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // { userId, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
