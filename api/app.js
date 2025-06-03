import fs from "node:fs/promises";

import bodyParser from "body-parser";
import express from "express";

const app = express();

app.use(express.static("images"));
app.use(bodyParser.json());

// CORS

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all domains
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  next();
});

app.get("/all-events", async (req, res) => {
  //return res.status(500).json();
  await new Promise((resolve) => setTimeout(resolve, 250));

  const fileContent = await fs.readFile("./data/events/events.json");

  const data = JSON.parse(fileContent);

  res.status(200).json({ events: data });
});

app.get("/events/:id", async (req, res) => {
  const eventId = req.params.id;

  const fileContent = await fs.readFile("./data/events/events.json");
  const data = JSON.parse(fileContent);

  const index = data.findIndex((event) => event.eventId === eventId);
  if (index >= 0) {
    res.status(200).json({ event: events[index] });
  }

  res.status(404).json("I dont have that");
});

// 404
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  res.status(404).json({ message: "404 - Not Found" });
});

app.listen(3000);
