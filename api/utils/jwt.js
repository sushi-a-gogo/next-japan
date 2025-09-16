// jwt.js
import jwt from "jsonwebtoken";

const JWT_EXPIRES_IN = "1y"; // demo-friendly, but still keeps exp in payload

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not set in environment");
  }
  return process.env.JWT_SECRET;
}

export function generateToken(userId, email) {
  const JWT_SECRET = getJwtSecret();
  const token = jwt.sign({ userId, email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  console.log("generatedToken", { userId, email, token });
  return token;
}

export function verifyToken(token) {
  const JWT_SECRET = getJwtSecret();
  const verify = jwt.verify(token, JWT_SECRET);
  console.log("verifyToken", { verify, token });
  return verify;
}
