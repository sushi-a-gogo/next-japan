import dotenv from "dotenv";
import * as aiPrompts from "../utils/aiPrompts.js";
import getProviders from "../utils/aiProviders.js";
import { uploadImageToCloudflare } from "../utils/cloudflare.js";

dotenv.config();

const keys = {
  openai: process.env?.OPENAI_API_KEY || "OPENAI_API_KEY",
  xai: process.env?.XAI_API_KEY || "XAI_API_KEY",
};
const providers = getProviders(keys);

export async function fetchHaiku() {
  console.log("fetchHaiku called.");
  const prompt = aiPrompts.haikuPrompt;
  const result = await fetchTextResultFromAI(providers.grok, prompt);
  console.log(result);
  const aiTextResponse = result.output_text;
  return aiTextResponse || "Something went wrong. Please try again later.";
}

export async function fetchGeneratedContent(promptParams) {
  console.log("fetchGeneratedContent called with:", promptParams);

  const providerKey = promptParams.aiProvider || "openai";
  const provider = providers[providerKey.toLowerCase()];
  if (!provider) throw new Error("Invalid AI provider");

  const customText = promptParams.customText || "Happy day.";

  if (!(await isPromptSafe(customText))) {
    throw new Error("Prompt violates content guidelines.");
  }

  const textPrompt = aiPrompts.eventDescriptionPrompt(promptParams, customText);
  const imagePrompt =
    provider.name === "Grok"
      ? aiPrompts.grokEventImagePrompt(promptParams, customText)
      : aiPrompts.eventImagePrompt(promptParams, customText);

  // Text generation
  const textResponse = await fetchTextResultFromAI(provider, textPrompt);
  console.log(textResponse);

  let aiGeneratedEvent = null,
    aiTextResponse = null;

  try {
    aiTextResponse = textResponse.output_text;
    const content = aiTextResponse.trim();
    // Optional: strip code block if present
    const jsonString = content.replace(/^```json\n?|\n?```$/g, "").trim();
    aiGeneratedEvent = JSON.parse(jsonString);
    console.log("AI generated event", aiGeneratedEvent);
  } catch (parseError) {
    console.error("Malformed AI text response:", aiTextResponse);
    throw new Error(
      `Failed to parse ${provider.name} text response: ${parseError.message}`,
    );
  }

  // Basic structure validation
  if (!aiGeneratedEvent?.eventTitle || !aiGeneratedEvent?.description) {
    throw new Error("AI returned incomplete event data");
  }

  // Inside fetchGeneratedContent, after text generation...

  // Image generation
  let imageUrlForSave = null;
  let base64Image = null;

  try {
    const imageResponse = await fetchImageResultFromAI(provider, imagePrompt);

    if (!imageResponse?.data?.[0]) {
      throw new Error("No image data returned");
    }

    const imageData = imageResponse.data[0];

    // Handle both old url and new b64_json (works for OpenAI gpt-image-1 and Grok)
    if (imageData.b64_json) {
      base64Image = imageData.b64_json;
    } else if (imageData.url) {
      // fallback for older models or Grok when response_format=url
      imageUrlForSave = imageData.url;
    } else {
      throw new Error("Image response missing both url and b64_json");
    }
  } catch (imgError) {
    console.warn(
      `Image generation failed for ${provider.name}:`,
      imgError.message,
    );
    throw imgError;
  }

  const imageName = `event-image-${Date.now()}.png`;

  // === NEW: Upload to Cloudflare immediately ===
  let finalDeliveryUrl = null;
  let cloudflareImageId = null;

  if (base64Image) {
    // Convert base64 → data URL for the upload function (or modify uploadImageToCloudflare to accept raw base64)
    const dataUrl = `data:image/png;base64,${base64Image}`;

    const uploadResult = await uploadImageToCloudflare(
      { id: imageName, width: 1536, height: 1024 }, // or extract real dimensions if available
      dataUrl,
    );

    cloudflareImageId = uploadResult.cloudflareImageId;
    finalDeliveryUrl = uploadResult.deliveryUrl;
  } else if (imageUrlForSave) {
    // If we got a temporary URL (rare now), you could still upload it
    const uploadResult = await uploadImageToCloudflare(
      { id: imageName, width: 1536, height: 1024 },
      imageUrlForSave,
    );
    cloudflareImageId = uploadResult.cloudflareImageId;
    finalDeliveryUrl = uploadResult.deliveryUrl;
  }

  return {
    ...aiGeneratedEvent,
    image:
      base64Image || imageUrlForSave
        ? { id: imageName, width: 1536, height: 1024 }
        : null,
    imageUrl: finalDeliveryUrl, // ← This is the key change
    aiProvider: provider.name,
    prompt: { text: textPrompt, image: imagePrompt },
    // Optional: you can still return base64Image if you want it for debugging
    // base64Image
  };
}

// --- Private helpers ---
async function isPromptSafe(userPrompt) {
  const moderation = await providers.openai.client.moderations.create({
    input: userPrompt,
  });
  return !moderation.results[0].flagged;
}

async function fetchHaikuResultFromAI(provider, prompt) {
  const response = await provider.client.responses.create({
    model: provider.model,
    instructions: "You are a creative assistant generating engaging text.",
    input: prompt,
    max_output_tokens: 512,
    temperature: 1.1,
    top_p: 0.85,
    n: 4,
  });
  const randomIndex = Math.floor(Math.random() * response.choices.length);
  return { choices: [response.choices[randomIndex]] };
}

async function fetchTextResultFromAI(provider, prompt) {
  return provider.client.responses.create({
    model: provider.model,
    instructions: "You are a creative assistant generating engaging text.",
    input: prompt,
    max_output_tokens: 512,
    temperature: 0.7,
  });
}

async function fetchImageResultFromAI(provider, prompt) {
  const params = {
    model: provider.imageModel,
    prompt,
    n: 1,
  };
  if (provider.name === "OpenAI") {
    params.size = "1536x1024";
  }

  if (provider.name === "Grok") {
    params.aspect_ratio = "16:9";
    params.response_format = "b64_json";
  }

  console.log("Sending image request:", params);
  return provider.client.images.generate(params);
}
