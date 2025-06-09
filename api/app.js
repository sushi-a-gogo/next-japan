import fs from "node:fs/promises";

import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import openAiRouter from "./openai-integration.js"; // Adjust path if needed

const app = express();
dotenv.config();

app.use(express.static("public"));
app.use(express.json()); // Parse JSON bodies

// CORS
app.use(cors());

// Mount the OpenAI router
app.use("/api", openAiRouter);

app.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;
  console.log("Prompt received:", prompt);
  console.log(
    "API key:",
    process.env.OPENAI_API_KEY ? "Key present" : "Key missing"
  );

  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return res
      .status(400)
      .json({ error: "Prompt is required and must be a non-empty string" });
  }

  try {
    const requestBody = {
      model: "dall-e-3",
      prompt: prompt.trim(),
      n: 1,
      size: "1024x1024",
      response_format: "url",
    };
    console.log("Request body:", JSON.stringify(requestBody, null, 2));

    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const imageUrl = response.data.data[0].url;
    res.json({ imageUrl });
  } catch (error) {
    console.error(
      "Error response:",
      JSON.stringify(error.response?.data, null, 2)
    );
    console.error("Error message:", error.message);
    console.error("Status code:", error.response?.status);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || "Image generation failed",
    });
  }
});

app.get("/organization", async (req, res) => {
  //return res.status(500).json();
  const fileContent = await fs.readFile("./data/organization.json");
  const data = JSON.parse(fileContent);
  res.status(200).json({ data });
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

  const index = events.findIndex((event) => event.eventId === eventId);
  if (index >= 0) {
    return res.status(200).json({ event: events[index] });
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

//module.exports = router;
app.listen(3000);
