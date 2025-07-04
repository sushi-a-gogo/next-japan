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
  const items = JSON.parse(opportunityJson);

  const eventJson = await fs.readFile(EVENTS_JSON, "utf-8");
  const events = JSON.parse(eventJson);

  const locationJson = await fs.readFile(LOCATIONS_JSON, "utf-8");
  const locations = JSON.parse(locationJson);

  const opportunities = items.map((o) => {
    const event = events.find((e) => e.eventId === o.eventId);
    const location = locations.find((l) => l.locationId === o.locationId);
    return {
      ...o,
      ...location,
      eventTitle: event.eventTitle,
      image: event.image,
    };
  });

  opportunities.sort((a, b) =>
    new Date(a.startDate) < new Date(b.startDate) ? -1 : 1
  );

  if (eventId) {
    return opportunities.filter((opp) => opp.eventId === eventId);
  }

  return opportunities;
}

router.get("/search", async (req, res) => {
  const query = req.query.q?.toLowerCase() || "";
  const verbose = req.query.v?.toLowerCase() || "";

  const eventJson = await fs.readFile(EVENTS_JSON, "utf-8");
  const events = JSON.parse(eventJson);

  const filteredEvents = events.filter(
    (event) =>
      event.eventTitle.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.fullDescription.toLowerCase().includes(query)
  );

  if (verbose === "1") {
    const locationJson = await fs.readFile(LOCATIONS_JSON, "utf-8");
    const locations = JSON.parse(locationJson);
    filteredEvents.forEach((event) => {
      event.locations = event.locations.map((locationId) =>
        locations.find((l) => l.locationId === locationId)
      );
    });
    res.json(filteredEvents);
  } else {
    res.json(
      filteredEvents.map((e) => ({
        eventId: e.eventId,
        eventTitle: e.eventTitle,
        description: e.description,
        image: e.image,
      }))
    );
  }
});

router.get("/:id", async (req, res) => {
  const eventId = Number(req.params.id);
  const eventJson = await fs.readFile(EVENTS_JSON, "utf-8");
  const locationJson = await fs.readFile(LOCATIONS_JSON, "utf-8");
  const events = JSON.parse(eventJson);
  const locations = JSON.parse(locationJson);
  const eventOpportunities = await readOpportunities(eventId);

  const index = events.findIndex((event) => event.eventId === eventId);
  if (index === -1) {
    return res.status(404).json("I dont have that");
  }

  const event = events[index];
  event.locations = event.locations.map((locationId) =>
    locations.find((l) => l.locationId === locationId)
  );
  if (eventOpportunities.length) {
    event.minDate = eventOpportunities[0].startDate;
    event.maxDate = eventOpportunities[eventOpportunities.length - 1].startDate;
  }

  res.status(200).json({ event });
});

router.get("/:id/opportunities", async (req, res) => {
  const eventId = Number(req.params.id);
  const eventOpportunities = await readOpportunities(eventId);
  return res.status(200).json({ eventOpportunities });
});

export default router;
