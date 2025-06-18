import dotenv from "dotenv";
import express from "express";
import fs from "node:fs/promises";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/info", async (req, res) => {
  //return res.status(500).json();
  const filePath = path.resolve(__dirname, "..", "data", "organization.json");
  const fileContent = await fs.readFile(filePath, "utf-8");
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
    const filePath = path.resolve(
      __dirname,
      "..",
      "data",
      "opportunities",
      files[i]
    );
    const fileContent = await fs.readFile(filePath, "utf-8");
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
  const filePath = path.resolve(
    __dirname,
    "..",
    "data",
    "events",
    "events.json"
  );
  const fileContent = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(fileContent);

  res.status(200).json({ events: data });
});

export default router;
