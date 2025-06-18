import dotenv from "dotenv";
import express from "express";
import fs from "node:fs/promises";

dotenv.config();

const router = express.Router();

router.get("/info", async (req, res) => {
  //return res.status(500).json();
  const fileContent = await fs.readFile("./data/organization.json");
  const data = JSON.parse(fileContent);
  res.status(200).json({ data });
});

router.get("/opportunities", async (req, res) => {
  const files = [
    "event-1-opportunities.json",
    "event-2-opportunities.json",
    "event-3-opportunities.json",
  ];

  const nextOpportunities = [];
  for (let i = 0; i < files.length; i++) {
    const fileContent = await fs.readFile(`./data/opportunities/${files[i]}`);
    const eventOpportunities = JSON.parse(fileContent);
    eventOpportunities.sort((a, b) =>
      new Date(a.startDate) < new Date(b.startDate) ? -1 : 1
    );
    nextOpportunities.push(eventOpportunities[0]);
  }

  return res.status(200).json({ opportunities: nextOpportunities });
});

router.get("/events", async (req, res) => {
  //return res.status(500).json();
  const fileContent = await fs.readFile("./data/events/events.json");

  const data = JSON.parse(fileContent);

  res.status(200).json({ events: data });
});

export default router;
