import jwt from "jsonwebtoken";

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not set in environment");
  }
  return process.env.JWT_SECRET;
}

function getJwtRefreshSecret() {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET not set in environment");
  }
  return process.env.JWT_REFRESH_SECRET;
}

function generateToken(userId, email, expiresIn, secret) {
  const token = jwt.sign({ userId, email }, secret, {
    expiresIn,
  });
  return token;
}

function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

export function generateAccessToken(userId, email) {
  const secret = getJwtSecret();
  return generateToken(userId, email, "10m", secret);
}

export function generateRefreshToken(userId, email) {
  const secret = getJwtRefreshSecret();
  return generateToken(userId, email, "7d", secret);
}

export function verifyAccessToken(token) {
  const secret = getJwtSecret();
  return verifyToken(token, secret);
}

export function verifyRefreshToken(token) {
  const secret = getJwtRefreshSecret();
  return verifyToken(token, secret);
}
