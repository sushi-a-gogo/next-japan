import * as eventLocationService from "../services/eventLocationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NotFoundError } from "../utils/errors.js";

// GET all locations
export const getLocations = asyncHandler(async (req, res) => {
  const locations = await eventLocationService.getLocations();
  res.status(200).json({ success: true, data: locations });
});

// GET location by id
export const getLocationById = asyncHandler(async (req, res) => {
  const location = await eventLocationService.getLocationById(
    req.params.locationId
  );
  if (!location) throw new NotFoundError("Location not found");

  res.status(200).json({ success: true, data: location });
});

// GET event-specific locations
export const getEventLocation = asyncHandler(async (req, res) => {
  const location = await eventLocationService.getEventLocation(
    req.params.eventId
  );
  res.status(200).json({ success: true, data: location });
});

// GET event-specific locations
export const getEventLocations = asyncHandler(async (req, res) => {
  const locations = await eventLocationService.getEventLocations(
    req.params.eventId
  );
  res.status(200).json({ success: true, data: locations });
});
