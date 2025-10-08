// controllers/eventController.js
import * as eventService from "../services/eventService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authorized } from "../utils/authHelpers.js";
import { NotFoundError } from "../utils/errors.js";

export const getEvents = asyncHandler(async (req, res) => {
  const events = await eventService.getRecentEvents();
  res.status(200).json({ success: true, data: events });
});

export const getEventById = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);
  if (!event) throw new NotFoundError("Event not found");

  res.status(200).json({ success: true, data: event });
});

export const saveEvent = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;

  const saved = await eventService.saveEvent(req.body);
  res.status(201).json({ success: true, data: saved });
});
