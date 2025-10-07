// controllers/eventRegistrationController.js
import * as registrationService from "../services/eventRegistrationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authorized } from "../utils/authHelpers.js";
import { NotFoundError } from "../utils/errors.js";

// ✅ Get all registrations for a user
export const getUserRegistrations = asyncHandler(async (req, res) => {
  if (!authorized(req, res, true)) return;

  const { userId } = req.params;
  const registrations = await registrationService.getUserRegistrations(userId);

  res.status(200).json({ success: true, data: registrations });
});

// ✅ Create new registration
export const createRegistration = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;

  const { userId, status, opportunityId } = req.body;
  const registration = await registrationService.createUserRegistration(
    userId,
    status,
    opportunityId
  );

  // Return full registration object
  res
    .status(201)
    .json({ success: true, data: { registrationId: registration._id } });
});

// ✅ Get single registration
export const getRegistrationById = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;

  const { registrationId } = req.params;
  const registration = await registrationService.getRegistrationById(
    registrationId
  );

  if (!registration) throw new NotFoundError("Registration not found");

  res.status(200).json({ success: true, data: registration });
});

// ✅ Update registration
export const updateRegistration = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;

  const { registrationId } = req.params;
  const { userId, status, opportunityId } = req.body;

  const registration = await registrationService.updateRegistration(
    registrationId,
    userId,
    status,
    opportunityId
  );

  if (!registration) throw new NotFoundError("Event Registration not found");

  res
    .status(200)
    .json({ success: true, data: { registrationId: registration._id } });
});

// ✅ Delete registration
export const deleteRegistration = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;

  const { registrationId } = req.params;
  const deleted = await registrationService.deleteRegistration(registrationId);

  if (!deleted) throw new NotFoundError("Event Registration not found");

  res
    .status(200)
    .json({ success: true, data: { registrationId: deleted._id } });
});
