import User from "../models/User.js";

export const findUser = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }

  const formattedUser = {
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

  return formattedUser;
};
