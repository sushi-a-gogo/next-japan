import fs from "node:fs/promises";

import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import imageResizeRouter from "./image-resize.js";
import openAiRouter from "./openai-integration.js";

const app = express();
dotenv.config();

app.use(express.static("public"));
app.use(express.json()); // Parse JSON bodies

// CORS
app.use(cors());
// app.use(
//   cors({
//     origin: "https://your-angular-app.vercel.app",
//   })
// );

// Mount the OpenAI router
app.use("/api", openAiRouter);
// Mount the image resize router
app.use("/api/image", imageResizeRouter);

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

app.get("/organization", async (req, res) => {
  //return res.status(500).json();
  const fileContent = await fs.readFile("./data/organization.json");
  const data = JSON.parse(fileContent);
  res.status(200).json({ data });
});

app.get("/opportunities", async (req, res) => {
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

app.get("/events", async (req, res) => {
  //return res.status(500).json();
  const fileContent = await fs.readFile("./data/events/events.json");

  const data = JSON.parse(fileContent);

  res.status(200).json({ events: data });
});

app.get("/event/:id", async (req, res) => {
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

app.get("/event/:id/opportunities", async (req, res) => {
  const eventId = Number(req.params.id);
  const eventOpportunities = await readOpportunities(eventId);
  return res.status(200).json({ eventOpportunities });
});

// 404
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  res.status(404).json({ message: "404 - Not Found" });
});

//module.exports = router;
app.listen(3000);
