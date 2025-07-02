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
  apiKey: process.env.OPENAI_API_KEY || "[API_KEY]", // Set in .env file
});

const providers = {
  openai: {
    client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "[API_KEY]" }),
    model: "gpt-4o-mini", // ...or 'gpt-3.5-turbo' for cost savings
    imageModel: "dall-e-3",
  },
  grok: {
    client: new OpenAI({
      apiKey: process.env.XAI_API_KEY || "[API_KEY]",
      baseURL: "https://api.x.ai/v1", // Override for Grok
    }),
    model: "grok-3", // Adjust based on xAI docs
    imageModel: "grok-2-image-1212", //"grok-2-image",
  },
};

// POST endpoint to handle text and image generation
router.post("/generate-content", async (req, res) => {
  //await new Promise((resolve) => setTimeout(resolve, 3000));
  //return res.status(500).json({ error: "Failed to generate content" });

  try {
    // Expecting params and custom text from Angular front-end
    const { promptParams, customText, aiProvider } = req.body;

    // Validate input
    if (!promptParams || !customText) {
      return res
        .status(400)
        .json({ error: "Missing promptParams or customText" });
    }

    if (!(await isPromptSafe(customText))) {
      throw new Error(
        "Prompt violates content guidelines. Please use appropriate language."
      );
    }

    const providerKey = aiProvider || "OpenAI";
    const provider = providers[providerKey.toLowerCase()];
    console.log("Selected provider" + providerKey);

    // Construct text prompt
    const textPrompt = `Generate creative text describing a day long special event in Japan using 100 words or less and based on these parameters: ${JSON.stringify(
      promptParams
    )}. User input: ${customText}`;
    console.log(`Call ${providerKey} Chat API for text: ` + textPrompt);

    // Construct image prompt
    const imagePrompt = `Create an image in a cel-shaded, anime style,
    using a color palette of warm glowing tones together with bright pastels,
    and a theme inspired by Studio Ghibli movies, '${customText}' and these parameters: ${JSON.stringify(
      promptParams
    )}.
    Generate a family-friendly, non-violent, non-sexual, non-offensive image suitable for all audiences,
    adhering to strict content moderation guidelines. Avoid nudity, gore, hate symbols, or any inappropriate content.
    Avoid close-up or foreground characters.
    Keep focus on the landscape and mood; characters should feel like a natural part of the scene.
    The image should not contain any text or symbols.`;
    console.log(`Call ${providerKey} API for image: ` + imagePrompt);

    const imageResponse = await getImageResultFromAI(provider, imagePrompt);
    // Call AI API for text
    const textResponse = await getTextResultFromAI(provider, textPrompt);
    const generatedText = textResponse.choices[0].message.content;

    // Call AI Image API
    //const imageResponse = await getImageResultFromAI(provider, imagePrompt);
    const imageUrl = imageResponse.data[0].url;
    // Download and save image locally
    const imageName = `image-${Date.now()}.png`;
    const imagePath = path.join("public/images", imageName);
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(imagePath, buffer);

    // Return local image URL
    const localImageUrl = `/images/${imageName}`; // Serve from your Express static folder

    // Return both text and image to front-end
    res.json({
      text: generatedText,
      imageUrl: localImageUrl,
      image: { id: imageName, width: 1792, height: 1024 },
    });
  } catch (error) {
    console.error("Error with AI API:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

async function isPromptSafe(userPrompt) {
  const moderation = await openai.moderations.create({ input: userPrompt });
  return !moderation.results[0].flagged;
}

async function getTextResultFromAI(provider, prompt) {
  const textResponse = await provider.client.chat.completions.create({
    model: provider.model,
    messages: [
      {
        role: "system",
        content:
          "You are a creative assistant generating engaging text for a Japanese travel agency.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 512, // Increased to allow for longer responses
    temperature: 0.7,
  });
  return textResponse;
}

async function getImageResultFromAI(provider, prompt) {
  const requestParams = {
    model: provider.imageModel,
    prompt,
    n: 1,
  };

  if (provider.imageModel === "dall-e-3") {
    requestParams.size = "1792x1024";
  }

  const imageResponse = await provider.client.images.generate(requestParams);
  return imageResponse;
}

function createGhibliStylePrompt({
  destination,
  tone,
  mood,
  subject = "a father and daughter",
}) {
  return `
An anime-style digital painting inspired by Studio Ghibli films like "My Neighbor Totoro" and "Kiki's Delivery Service".

Style:
- Hand-drawn, painterly textures.
- cel-shaded, anime-style
- Bright pastels and warm glowing light.
- Stylized backgrounds with whimsical fantasy elements.
- Soft shading, simple shapes, expressive character faces.

Scene:
- ${subject} at ${destination}, with a ${tone} and ${mood} feeling.
- Include iconic Japanese nature: cherry blossoms, rolling hills, clear sky, gentle breeze.

Characters:
- Similar character design to those seen in Studio Ghibli films.

Visual feel:
- Avoid realism or photorealistic textures.
- Avoid close-up or foreground characters
- Avoid harsh lighting or contrast
- Emulate animation cels or watercolor backgrounds.
- Keep focus on the landscape and mood; characters should feel like a natural part of the scene.
`.trim();
}

export default router;
