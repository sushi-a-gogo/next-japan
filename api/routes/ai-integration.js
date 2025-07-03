import axios from "axios";
import dotenv from "dotenv";
import express from "express";
import FormData from "form-data";
import OpenAI from "openai";

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
    imageModel: "grok-2-image-1212", //"grok-2-image",
  },
};

// POST endpoint to handle text and image generation
router.post("/generate-content", async (req, res) => {
  //await new Promise((resolve) => setTimeout(resolve, 3000));
  //return res.status(500).json({ error: "Failed to generate content" });
  // Expecting params and custom text from Angular front-end
  const { promptParams, customText, aiProvider } = req.body;
  const providerKey = aiProvider || "OpenAI";
  const provider = providers[providerKey.toLowerCase()];

  // Validate input
  if (!promptParams || !customText) {
    return res
      .status(400)
      .json({ error: "Missing promptParams or customText" });
  }

  try {
    if (!(await isPromptSafe(customText))) {
      throw new Error(
        "Prompt violates content guidelines. Please use appropriate language."
      );
    }

    const textPrompt = createTextPrompt(promptParams, customText);
    const imagePrompt = createImagePrompt(promptParams, customText);

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
      aiProvider,
      prompt: { text: textPrompt, image: imagePrompt },
    });
  } catch (error) {
    console.error("Error with AI API:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

router.post("/save", async (req, res) => {
  try {
    const { eventTitle, description, image, imageUrl, aiProvider, prompt } =
      req.body;

    // Input validation
    if (!eventTitle || !description || !imageUrl) {
      return res.status(400).json({
        error: "Missing required fields: title, description, or imageUrl",
      });
    }

    // Upload image to Cloudflare
    const formData = new FormData();
    const imageBuffer = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const filename = image.id;
    formData.append("file", imageBuffer.data, {
      filename,
    });

    const cloudfareUploadUrl = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`;
    console.log("Upload image to: " + cloudfareUploadUrl);

    const cloudflareResponse = await axios.post(cloudfareUploadUrl, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      },
    });

    if (!cloudflareResponse.data.success) {
      throw new Error("Cloudflare upload failed");
    }

    const cloudflareImageId = cloudflareResponse.data.result.id;
    const deliveryUrl = `https://imagedelivery.net/${process.env.CLOUDFLARE_ACCOUNT_HASH}/${cloudflareImageId}/public?w=1792&h=1024&format=webp`;

    // Response (MongoDB integration to follow)
    return res.status(201).json({
      success: true,
      data: {
        eventTitle,
        description,
        image: {
          id: filename,
          cloudflareImageId,
          width: image.width,
          height: image.height,
        },
        imageUrl: deliveryUrl,
        aiProvider,
        prompt,
      },
    });
  } catch (error) {
    console.error("Save event error:", error.message || error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to save event",
    });
  }
});

async function isPromptSafe(userPrompt) {
  const moderation = await openai.moderations.create({ input: userPrompt });
  return !moderation.results[0].flagged;
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

  if (provider.imageModel === "dall-e-3") {
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
      'description': a creative text narrative (max 200 words),
      'eventTitle': a concise title inspired by the description (3-5 words).
  Return only the raw JSON object, no additional text.
  Do not include Markdown, code blocks, or extra text—output valid JSON only.
  Output should look like: {'description': 'text...', 'eventTitle': 'title...'}.`;
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
