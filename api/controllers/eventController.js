// controllers/eventController.js
import * as eventService from "../services/eventService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";

export const getEvents = asyncHandler(async (req, res) => {
  const events = await eventService.getRecentEvents();
  res.status(200).json({ success: true, events });
});

export const searchEvents = asyncHandler(async (req, res) => {
  const query = req.query.q || "";
  const events = await eventService.searchEvents(query);
  res.json(events);
});

export const getEventById = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);
  if (!event) throw new NotFoundError("Event not found");

  res.status(200).json({ success: true, event });
});

export const saveEvent = asyncHandler(async (req, res) => {
  if (!req.body.eventTitle)
    throw new ValidationError("Event title is required");

  const saved = await eventService.saveEvent(req.body);
  res.status(201).json({ success: true, data: saved });
});
