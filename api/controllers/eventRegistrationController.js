import * as registrationService from "../services/eventRegistrationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authorized } from "../utils/authHelpers.js";
import { NotFoundError } from "../utils/errors.js";

// GET event registrations for user
export const getEventRegistrationsForUser = asyncHandler(async (req, res) => {
  if (!authorized(req, res, true)) return;

  const { userId } = req.params;
  const registrations = await registrationService.getEventRegistrationsForUser(
    userId
  );

  res.status(200).json({ success: true, data: registrations });
});

// GET event registration by id
export const getEventRegistrationById = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;

  const { registrationId } = req.params;
  const registration = await registrationService.getEventRegistrationById(
    registrationId
  );

  if (!registration) throw new NotFoundError("Registration not found");

  res.status(200).json({ success: true, data: registration });
});

// POST new event registration
export const createEventRegistration = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;

  const registration = await registrationService.createEventRegistration(
    req.body
  );

  res
    .status(201)
    .json({ success: true, data: { registrationId: registration._id } });
});

// PUT update event registration
export const updateEventRegistration = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;

  const { registrationId } = req.params;

  const registration = await registrationService.updateEventRegistration(
    registrationId,
    req.body
  );

  if (!registration) throw new NotFoundError("Event Registration not found");

  res
    .status(200)
    .json({ success: true, data: { registrationId: registration._id } });
});

// DELETE event registration
export const deleteEventRegistration = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;

  const { registrationId } = req.params;
  const deleted = await registrationService.deleteEventRegistration(
    registrationId
  );

  if (!deleted) throw new NotFoundError("Event Registration not found");

  res
    .status(200)
    .json({ success: true, data: { registrationId: deleted._id } });
});
