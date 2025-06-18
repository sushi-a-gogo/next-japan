import dotenv from "dotenv";
import express from "express";
import fs from "node:fs/promises";

import {
  EVENTS_JSON,
  OPPORTUNITIES_JSON,
  ORGANIZATION_JSON,
} from "../utils/paths.js";

dotenv.config();

const router = express.Router();

router.get("/info", async (req, res) => {
  //return res.status(500).json();
  const fileContent = await fs.readFile(ORGANIZATION_JSON, "utf-8");
  const data = JSON.parse(fileContent);
  res.status(200).json({ data });
});

router.get("/opportunities", async (req, res) => {
  const files = OPPORTUNITIES_JSON;

  const nextOpportunities = [];
  for (let i = 0; i < files.length; i++) {
    const fileContent = await fs.readFile(files[i], "utf-8");
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
  const fileContent = await fs.readFile(EVENTS_JSON, "utf-8");
  const data = JSON.parse(fileContent);

  res.status(200).json({ events: data });
});

export default router;
