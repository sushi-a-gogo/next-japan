import dotenv from "dotenv";
import express from "express";
import fs from "node:fs/promises";
import {
  EVENTS_FULL_JSON,
  EVENTS_JSON,
  OPPORTUNITIES_JSON,
} from "../utils/paths.js";

dotenv.config();

const router = express.Router();

async function readOpportunities(eventId) {
  const files = OPPORTUNITIES_JSON;

  let opportunities = [];
  for (let i = 0; i < files.length; i++) {
    const fileContent = await fs.readFile(files[i], "utf-8");
    const eventOpportunities = JSON.parse(fileContent);
    opportunities = [...opportunities, ...eventOpportunities];
  }

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
  const fileContent = await fs.readFile(EVENTS_FULL_JSON, "utf-8");
  const fullEvents = JSON.parse(fileContent);
  const filteredEvents = fullEvents.filter(
    (event) =>
      event.eventTitle.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.fullDescription.toLowerCase().includes(query)
  );

  if (verbose === "1") {
    res.json(filteredEvents);
  } else {
    const content = await fs.readFile(EVENTS_JSON, "utf-8");
    const events = JSON.parse(content);
    res.json(
      events.filter(
        (e) => !!filteredEvents.find((fe) => e.eventId === fe.eventId)
      )
    );
  }
});

router.get("/:id", async (req, res) => {
  const eventId = Number(req.params.id);
  const fileContent = await fs.readFile(EVENTS_FULL_JSON, "utf-8");
  const events = JSON.parse(fileContent);
  const eventOpportunities = await readOpportunities(eventId);

  const index = events.findIndex((event) => event.eventId === eventId);
  if (index === -1) {
    return res.status(404).json("I dont have that");
  }

  const event = events[index];
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
