import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";
import { authMiddleware } from "../middleware/auth.js";
import { authorized } from "../utils/authHelpers.js";

dotenv.config();

const router = express.Router();

// Initialize OpenAI with your API key (store securely in env vars)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "[API_KEY]", // Set in .env file
});

const providers = {
  openai: {
    name: "OpenAI",
    client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "[API_KEY]" }),
    model: "gpt-4o-mini", // ...or 'gpt-3.5-turbo' for cost savings
    imageModel: "dall-e-3",
  },
  grok: {
    name: "Grok",
    client: new OpenAI({
      apiKey: process.env.XAI_API_KEY || "[API_KEY]",
      baseURL: "https://api.x.ai/v1", // Override for Grok
    }),
    model: "grok-3", // Adjust based on xAI docs
    imageModel: "grok-2-image-latest", //"grok-2-image",
  },
};

router.get("/generate-haiku", authMiddleware, async (req, res) => {
  const provider = providers.grok;
  const prompt = `Generate a haiku in English that uniquely describes 'Next Japan' - a Japanese vacation event planning website.
  Each line must start with a completely different, randomly chosen Unicode emoji embodying any aspect of Japanese culture, travel, or mystery (no examples provided).
  Explore a bold, unpredictable theme (e.g., cyberpunk Osaka, ancient tea rituals, haunted Aomori forests, futuristic Hokkaido farms),
  explicitly avoiding any repeated imagery, themes, or emojis from past outputs.
  Randomly switch between poetic styles (e.g., haiku with haibun flair, free-verse twist, or mythic tone) and perspectives
  (e.g., a lost tourist, a wandering fox spirit, a futuristic AI guide).
  Ensure the haiku is vibrant, evocative, and captures the diverse magic of Japanese travel.
  If you want, provide a brief explanation (explanation only, 25 words or less, and do NOT label it as an 'explanation') of the haiku's meaning - but this is optional.`;

  try {
    if (!authorized(req, res)) {
      return;
    }

    const haiku = await fetchHaikuResultFromAI(provider, prompt);
    res.json({
      success: true,
      data: haiku.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error with AI API:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

// POST endpoint to handle text and image generation
router.post("/generate-content", authMiddleware, async (req, res) => {
  // Expecting params from Angular front-end
  const { promptParams } = req.body;

  // Validate input
  if (!promptParams) {
    return res.status(400).json({ error: "Missing promptParams" });
  }

  //await new Promise((resolve) => setTimeout(resolve, 3000));
  //return res.status(500).json({ error: "Failed to generate content" });

  const providerKey = promptParams.aiProvider || "OpenAI";
  const provider = providers[providerKey.toLowerCase()];
  promptParams.aiProvider = undefined;

  const customText = promptParams.customText || "Happy day.";
  promptParams.customText = undefined;

  try {
    if (!authorized(req, res)) {
      return;
    }

    if (!(await isPromptSafe(customText))) {
      throw new Error(
        "Prompt violates content guidelines. Please use appropriate language."
      );
    }

    const textPrompt = createTextPrompt(promptParams, customText);
    const imagePrompt =
      provider.name === "Grok"
        ? createGrokImagePrompt(promptParams, customText)
        : createImagePrompt(promptParams, customText);

    // Call AI API for text
    const textResponse = await fetchTextResultFromAI(provider, textPrompt);
    const generatedTextJson = textResponse.choices[0].message.content;
    const aiGeneratedEvent = JSON.parse(generatedTextJson);

    // Call AI API for image
    const imageResponse = await fetchImageResultFromAI(provider, imagePrompt);
    const imageUrl = imageResponse.data[0].url;
    const imageName = `event-image-${Date.now()}.png`;
    // Download and save image locally
    // const imagePath = path.join("public/images", imageName);
    // const response = await fetch(imageUrl);
    // const arrayBuffer = await response.arrayBuffer();
    // const buffer = Buffer.from(arrayBuffer);
    // fs.writeFileSync(imagePath, buffer);

    // Return both text and image
    res.json({
      ...aiGeneratedEvent,
      image: { id: imageName, width: 1792, height: 1024 },
      imageUrl,
      aiProvider: provider.name,
      prompt: { text: textPrompt, image: imagePrompt },
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

async function fetchHaikuResultFromAI(provider, prompt) {
  console.log(`Call ${provider.name} API for text creation: ` + prompt);
  const textResponse = await provider.client.chat.completions.create({
    model: provider.model,
    messages: [
      {
        role: "system",
        content:
          "You are a wildly creative assistant crafting unique haikus for a Japanese travel agency. Each haiku must be entirely distinct in theme, imagery, and emojis, drawing from diverse facets of Japanese culture, travel, or mystery. Avoid repeating any patterns or ideas from previous outputs, and experiment with bold, varied styles.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 512,
    temperature: 1.1, // Upped to max creativity (from 0.9)
    top_p: 0.85, // Slightly tightened to keep coherence
    n: 4, // Generate 3 options, pick one randomly
  });
  // Randomly select one of the generated haikus
  const randomIndex = Math.floor(Math.random() * textResponse.choices.length);
  return { choices: [textResponse.choices[randomIndex]] };
}

async function fetchTextResultFromAI(provider, prompt) {
  console.log(`Call ${provider.name} API for text creation: ` + prompt);
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

async function fetchImageResultFromAI(provider, prompt) {
  console.log(`Call ${provider.name} API for image creation: ` + prompt);
  const requestParams = {
    model: provider.imageModel,
    prompt,
    n: 1,
  };

  if (provider.name === "OpenAI") {
    requestParams.size = "1792x1024";
  }

  const imageResponse = await provider.client.images.generate(requestParams);
  return imageResponse;
}

function createTextPrompt(promptParams, customText) {
  return `Generate a raw JSON object describing a day long special event in Japan based on these parameters:
  ${JSON.stringify(promptParams)}.
  User input: ${customText}.
  The JSON object must include these properties:
      'fullDescription': a creative text narrative (max 200 words),
      'description': a brief summary of the fullDescription value (max 30 words),
      'eventTitle': a concise title inspired by the description (3-5 words).
  Return only the raw JSON object, no additional text.
  Do not include Markdown, code blocks, or extra text—output valid JSON only.
  Output should look like: { 'eventTitle': 'title...', 'description': 'text...', 'fullDescription': 'text...' }.`;
}

function createImagePrompt(promptParams, customText) {
  return `Create an anime-style digital painting in a cel-shaded, anime style,
  using a color palette of warm glowing tones together with bright pastels,
  and a theme inspired by Studio Ghibli movies, '${customText}' and these parameters: ${JSON.stringify(
    promptParams
  )}.
  The image should be family-friendly, non-violent, non-offensive and suitable for all audiences,
  adhering to strict content moderation guidelines. Avoid nudity, gore, hate symbols, or any inappropriate content.
  Keep focus on the landscape and mood; characters should feel like a natural part of the scene.
  Avoid close-up or foreground characters.
  The image should not contain any text or symbols.`;
}

function createGrokImagePrompt(promptParams, customText) {
  return `Ultra-wide 16:9 landscape ONLY, cinematic 1920x1080 horizontal panoramic frame,
  ABSOLUTELY NO portrait or vertical composition.
  Generate a digital painting, using warm glowing tones and bright pastels,
  with no text, family-friendly, high resolution.
  The theme should be inspired by Studio Ghibli movies, '${customText}', and these parameters: ${JSON.stringify(
    promptParams
  )}.
  The image should have a cel-shaded, anime look-think Speed Racer.
  The image should have the appearance of a Japanese animated movie.
  Keep focus on the landscape and mood; characters should feel like a natural part of the scene.
  Characters should be depicted in anime style and should take up only a small portion of the image.
  The image should not contain any text or symbols.`;
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
