import dotenv from "dotenv";
import express from "express";
import fs from "node:fs/promises";

dotenv.config();

const router = express.Router();

async function readOpportunities(eventId) {
  const files = [
    "event-1-opportunities.json",
    "event-2-opportunities.json",
    "event-3-opportunities.json",
  ];

  let opportunities = [];
  for (let i = 0; i < files.length; i++) {
    const fileContent = await fs.readFile(`./data/opportunities/${files[i]}`);
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

router.get("/:id", async (req, res) => {
  const eventId = Number(req.params.id);
  const fileContent = await fs.readFile("./data/events/full-events.json");
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
