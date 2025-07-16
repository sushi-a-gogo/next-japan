import dotenv from "dotenv";
import express from "express";
import fs from "node:fs/promises";
import {
  EVENTS_JSON,
  LOCATIONS_JSON,
  OPPORTUNITIES_JSON,
} from "../utils/paths.js";

dotenv.config();

const router = express.Router();

async function readOpportunities(eventId) {
  const opportunityJson = await fs.readFile(OPPORTUNITIES_JSON, "utf-8");
  const items = JSON.parse(opportunityJson).filter(
    (item) => item.eventId === eventId
  );
  items.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return items;
}

router.get("/search", async (req, res) => {
  const query = req.query.q?.toLowerCase() || "";

  const eventJson = await fs.readFile(EVENTS_JSON, "utf-8");
  const events = JSON.parse(eventJson);

  const filteredEvents = events.filter(
    (event) =>
      event.eventTitle.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.fullDescription.toLowerCase().includes(query)
  );

  res.json(
    filteredEvents.map((e) => ({
      eventId: e.eventId,
      eventTitle: e.eventTitle,
      description: e.description,
      image: e.image,
    }))
  );
});

router.get("/:id", async (req, res) => {
  const eventId = req.params.id;
  const eventJson = await fs.readFile(EVENTS_JSON, "utf-8");
  const events = JSON.parse(eventJson);

  const index = events.findIndex((event) => event.eventId === eventId);
  if (index === -1) {
    return res.status(404).json("I dont have that");
  }

  const event = events[index];
  res.status(200).json({ event });
});

router.get("/:id/locations", async (req, res) => {
  const eventId = req.params.id;
  const eventOpportunities = await readOpportunities(eventId);

  const locationJson = await fs.readFile(LOCATIONS_JSON, "utf-8");
  const locations = JSON.parse(locationJson);
  const eventLocations = locations.filter(
    (l) => !!eventOpportunities.find((o) => o.locationId === l.locationId)
  );

  return res.status(200).json({ eventLocations });
});

router.get("/:id/opportunities", async (req, res) => {
  const eventId = req.params.id;
  const eventOpportunities = await readOpportunities(eventId);
  return res.status(200).json({ eventOpportunities });
});

export default router;
