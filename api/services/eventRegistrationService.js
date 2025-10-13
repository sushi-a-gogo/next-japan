import mongoose from "mongoose";
import EventOpportunity from "../models/EventOpportunity.js";
import EventRegistration, {
  formatRegistration,
} from "../models/EventRegistration.js";
import User from "../models/User.js";
import UserNotification from "../models/UserNotification.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";

export const getEventRegistrationsForUser = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ValidationError("Invalid userId format");
  }

  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  const registrations = await EventRegistration.find({ userId })
    .populate({
      path: "opportunityId",
      select:
        "locationId startDate endDate timeZone timeZoneAbbreviation timeZoneOffset notes",
      populate: [
        {
          path: "eventId",
          select:
            "_id eventTitle imageId cloudflareImageId imageWidth imageHeight",
        },
        {
          path: "locationId",
          select: "locationName addressLine1 city state zip latitude longitude",
        },
      ],
    })
    .lean();

  return registrations.map(formatRegistration);
};

export const createEventRegistration = async (data) => {
  const { userId, status, opportunityId } = data;

  if (!userId || !status || !opportunityId) {
    throw new ValidationError("Missing required fields");
  }

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(opportunityId)
  ) {
    throw new ValidationError("Invalid userId or opportunityId format");
  }

  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  const opportunity = await EventOpportunity.findById(opportunityId);
  if (!opportunity) throw new NotFoundError("Opportunity not found");

  if (!["requested", "registered", "cancelled"].includes(status)) {
    throw new ValidationError("Invalid status value");
  }

  const registration = await EventRegistration.create({
    userId,
    opportunityId,
    status,
  });

  // Immediate notification
  await UserNotification.create({
    userId,
    opportunityId,
    registrationId: registration._id.toString(),
    title: "We have received your registration request!",
    message:
      "Thanks for registering! Your request is in progress, and we're working to get you a spot.",
    sendAt: new Date(),
    pending: false,
  });

  // Follow-up notification (10–20 mins later)
  const followUpMinutes = Math.floor(Math.random() * 11) + 10;
  const sendAt = new Date(Date.now() + followUpMinutes * 60_000);

  await UserNotification.create({
    userId,
    opportunityId,
    registrationId: registration._id.toString(),
    title: "Your request was approved!",
    message:
      "Your registration has been confirmed. We look forward to seeing you at the event!",
    sendAt,
    pending: true,
  });

  return registration;
};

export const getEventRegistrationById = async (registrationId) => {
  if (!mongoose.Types.ObjectId.isValid(registrationId)) {
    throw new ValidationError("Invalid registrationId format");
  }

  const registration = await EventRegistration.findById(registrationId)
    .populate({
      path: "opportunityId",
      select:
        "locationId startDate endDate timeZone timeZoneAbbreviation timeZoneOffset notes",
      populate: [
        {
          path: "eventId",
          select:
            "_id eventTitle imageId cloudflareImageId imageWidth imageHeight",
        },
        {
          path: "locationId",
          select: "locationName addressLine1 city state zip latitude longitude",
        },
      ],
    })
    .lean();

  return registration ? formatRegistration(registration) : null;
};

export const updateEventRegistration = async (registrationId, data) => {
  const { userId, status, opportunityId } = data;

  if (!mongoose.Types.ObjectId.isValid(registrationId))
    throw new ValidationError("Invalid registrationId");
  if (!userId || !mongoose.Types.ObjectId.isValid(userId))
    throw new ValidationError("Invalid userId");
  if (!opportunityId || !mongoose.Types.ObjectId.isValid(opportunityId))
    throw new ValidationError("Invalid opportunityId");
  if (!["requested", "registered", "cancelled"].includes(status)) {
    throw new ValidationError("Invalid status value");
  }

  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  const opportunity = await EventOpportunity.findById(opportunityId);
  if (!opportunity) throw new NotFoundError("Event opportunity not found");

  const updated = await EventRegistration.findByIdAndUpdate(
    registrationId,
    { userId, opportunityId, status },
    { new: true }
  );

  return updated ? formatRegistration(updated.toObject()) : null;
};

export const deleteEventRegistration = async (registrationId) => {
  if (!mongoose.Types.ObjectId.isValid(registrationId)) {
    throw new ValidationError("Invalid registrationId");
  }

  const deleted = await EventRegistration.findByIdAndDelete(registrationId);
  if (deleted) {
    await UserNotification.create({
      userId: deleted.userId,
      opportunityId: deleted.opportunityId,
      title: "Registration Cancelled",
      message: "Your event registration has been cancelled.",
      sendAt: new Date(),
      pending: false,
    });
  }

  return deleted;
};
