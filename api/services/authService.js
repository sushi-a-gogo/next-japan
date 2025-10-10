import { NotFoundError } from "../utils/errors.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { findUser } from "./userService.js";

export const loginUser = async (data) => {
  const { email } = data;
  const user = await findUser(email);
  if (!user) throw new NotFoundError("User not found");

  const accessToken = generateAccessToken(user.userId, user.email);
  const refreshToken = generateRefreshToken(user.userId, user.email);
  return { accessToken, refreshToken, user };
};

export const fetchUser = async (refreshToken) => {
  const payload = verifyRefreshToken(refreshToken);
  const user = await findUser(payload.email);
  if (!user) throw new NotFoundError("User not found");

  // refresh the access token
  const newAccessToken = generateAccessToken(user.userId, user.email);
  return { newAccessToken, user };
};
