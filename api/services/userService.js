import User from "../models/User.js";
import UserReward from "../models/UserReward.js";
import { ValidationError } from "../utils/errors.js";

export const getAllUsers = async () => {
  const users = await User.find();
  return users.map(formatUser);
};

export const findUser = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return null;
  return formatUser(user);
};

export const findUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) return null;
  return formatUser(user);
};

export const findUserRewards = async (userId) => {
  const rewards = await UserReward.find({ userId }).lean();
  return rewards;
};

export const saveUser = async (data) => {
  const { firstName, lastName, email, subscriptionPlan } = data;

  if (!firstName || !lastName || !email || !subscriptionPlan) {
    throw new ValidationError("Missing required fields");
  }

  const user = new User({
    firstName,
    lastName,
    email,
    subscriptionPlan,
    isEmailPreferred: true,
  });
  const savedUser = await user.save();
  return savedUser;
};

export const findUserByIdAndUpdate = async (data) => {
  const {
    userId,
    firstName,
    lastName,
    email,
    subscriptionPlan,
    image,
    phone,
    isEmailPreferred,
    mode,
  } = data;

  if (
    !userId ||
    !firstName ||
    !lastName ||
    !email ||
    !image ||
    !subscriptionPlan
  ) {
    throw new ValidationError("Missing required fields");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      firstName,
      lastName,
      email,
      subscriptionPlan,
      imageId: image.id,
      imageHeight: image.height,
      imageWidth: image.width,
      cloudflareImageId: image.cloudflareImageId,
      phone,
      isEmailPreferred,
      mode: mode || null,
    },
    { new: true }
  );

  if (!updatedUser) return null;

  return formatUser(updatedUser);
};

function formatUser(user) {
  return {
    userId: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    subscriptionPlan: user.subscriptionPlan,
    image: {
      id: user.imageId,
      cloudflareImageId: user.cloudflareImageId,
      width: user.imageWidth,
      height: user.imageHeight,
    },
    phone: user.phone,
    isEmailPreferred: user.isEmailPreferred,
    mode: user.mode,
    createdAt: user.createdAt,
  };
}
