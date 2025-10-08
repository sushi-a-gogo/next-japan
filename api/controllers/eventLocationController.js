// controllers/eventController.js
import * as eventLocationService from "../services/eventLocationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NotFoundError } from "../utils/errors.js";

export const getLocations = asyncHandler(async (req, res) => {
  const locations = await eventLocationService.getLocations();
  res.status(200).json({ success: true, data: locations });
});

export const getLocationById = asyncHandler(async (req, res) => {
  const location = await eventLocationService.getLocationById(
    req.params.locationId
  );
  if (!location) throw new NotFoundError("Location not found");

  res.status(200).json({ success: true, data: location });
});

export const getEventLocations = asyncHandler(async (req, res) => {
  const locations = await eventLocationService.getEventLocations(
    req.params.eventId
  );
  res.status(200).json({ success: true, data: locations });
});
