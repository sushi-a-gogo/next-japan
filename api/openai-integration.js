import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import fetch from "node-fetch";
import OpenAI from "openai";
import path from "path";

dotenv.config();

const router = express.Router();

// Initialize OpenAI with your API key (store securely in env vars)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Set in .env file
});

// POST endpoint to handle text and image generation
router.post("/generate-content", async (req, res) => {
  try {
    // Expecting params and custom text from Angular front-end
    const { promptParams, customText } = req.body;

    // Validate input
    if (!promptParams || !customText) {
      return res
        .status(400)
        .json({ error: "Missing promptParams or customText" });
    }

    // Construct text prompt
    const textPrompt = `Generate creative text describing a day long special event in Japan based on these parameters: ${JSON.stringify(
      promptParams
    )}. User input: ${customText}`;

    // Call OpenAI Chat API for text
    const textResponse = await openai.chat.completions.create({
      model: "gpt-4o", // Or 'gpt-3.5-turbo' for cost savings
      messages: [
        {
          role: "system",
          content:
            "You are a creative assistant generating engaging text for a Japanese travel agency.",
        },
        { role: "user", content: textPrompt },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });
    const generatedText = textResponse.choices[0].message.content;

    // Construct image prompt
    const imagePrompt = `Create an image based on: ${customText} with style: ${
      promptParams.style || "realistic"
    }`;

    // Call OpenAI Image API (DALL·E)
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
    });
    const imageUrl = imageResponse.data[0].url;

    // Download and save image locally
    const imageName = `image-${Date.now()}.png`;
    const imagePath = path.join("public/images", imageName);
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    fs.writeFileSync(imagePath, buffer);

    // Return local image URL
    const localImageUrl = `/images/${imageName}`; // Serve from your Express static folder

    // Return both text and image to front-end
    res.json({
      text: generatedText,
      imageUrl: localImageUrl,
      image: { id: imageName, width: 1024, height: 1024 },
    });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

export default router;
