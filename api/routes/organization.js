import dotenv from "dotenv";
import express from "express";
import fs from "node:fs/promises";

import {
  EVENTS_JSON,
  LOCATIONS_JSON,
  OPPORTUNITIES_JSON,
  ORGANIZATION_JSON,
} from "../utils/paths.js";

dotenv.config();

const router = express.Router();

router.get("/info", async (req, res) => {
  //return res.status(500).json();

  //await new Promise((resolve) => setTimeout(resolve, 15000));
  try {
    const fileContent = await fs.readFile(ORGANIZATION_JSON, "utf-8");
    const data = JSON.parse(fileContent);
    res.status(200).json({ data });
  } catch (e) {
    console.error(e);
    return res.status(500).json();
  }
});

router.get("/opportunities", async (req, res) => {
  const opportunityJson = await fs.readFile(OPPORTUNITIES_JSON, "utf-8");
  const items = JSON.parse(opportunityJson);
  items.sort((a, b) =>
    new Date(a.startDate) < new Date(b.startDate) ? -1 : 1
  );

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

  const map = new Map();
  const nextOpportunities = [];
  for (let i = 0; i < opportunities.length; i++) {
    if (!map.get(opportunities[i].eventId)) {
      nextOpportunities.push(opportunities[i]);
      map.set(opportunities[i].eventId, true);
    }
  }

  return res.status(200).json({ opportunities: nextOpportunities });
});

router.get("/events", async (req, res) => {
  //return res.status(500).json();
  const fileContent = await fs.readFile(EVENTS_JSON, "utf-8");
  const data = JSON.parse(fileContent);

  const events = data.map((e) => ({
    eventId: e.eventId,
    eventTitle: e.eventTitle,
    description: e.description,
    image: e.image,
  }));
  res.status(200).json({ events });
});

export default router;
