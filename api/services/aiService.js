import dotenv from "dotenv";
import OpenAI from "openai";
import * as aiPrompts from "../utils/aiPrompts.js";

dotenv.config();

const providers = {
  openai: {
    name: "OpenAI",
    client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
    model: "gpt-4o-mini",
    imageModel: "dall-e-3",
  },
  grok: {
    name: "Grok",
    client: new OpenAI({
      apiKey: process.env.XAI_API_KEY,
      baseURL: "https://api.x.ai/v1",
    }),
    model: "grok-3",
    imageModel: "grok-2-image-latest",
  },
};

export async function fetchHaiku() {
  const prompt = aiPrompts.haikuPrompt;
  const result = await fetchHaikuResultFromAI(providers.grok, prompt);
  return result.choices[0].message.content;
}

export async function fetchGeneratedContent(promptParams) {
  const providerKey = promptParams.aiProvider || "openai";
  const provider = providers[providerKey.toLowerCase()];

  const customText = promptParams.customText || "Happy day.";

  if (!(await isPromptSafe(customText))) {
    throw new Error("Prompt violates content guidelines.");
  }

  const textPrompt = aiPrompts.eventDescriptionPrompt(promptParams, customText);
  const imagePrompt =
    provider.name === "Grok"
      ? aiPrompts.grokEventImagePrompt(promptParams, customText)
      : aiPrompts.eventImagePrompt(promptParams, customText);

  // text
  const textResponse = await fetchTextResultFromAI(provider, textPrompt);
  const aiGeneratedEvent = JSON.parse(textResponse.choices[0].message.content);

  // image
  const imageResponse = await fetchImageResultFromAI(provider, imagePrompt);
  const imageUrl = imageResponse.data[0].url;
  const imageName = `event-image-${Date.now()}.png`;

  return {
    ...aiGeneratedEvent,
    image: { id: imageName, width: 1792, height: 1024 },
    imageUrl,
    aiProvider: provider.name,
    prompt: { text: textPrompt, image: imagePrompt },
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
  const response = await provider.client.chat.completions.create({
    model: provider.model,
    messages: [
      { role: "system", content: "You are a wildly creative assistant..." },
      { role: "user", content: prompt },
    ],
    max_tokens: 512,
    temperature: 1.1,
    top_p: 0.85,
    n: 4,
  });
  const randomIndex = Math.floor(Math.random() * response.choices.length);
  return { choices: [response.choices[randomIndex]] };
}

async function fetchTextResultFromAI(provider, prompt) {
  return provider.client.chat.completions.create({
    model: provider.model,
    messages: [
      {
        role: "system",
        content: "You are a creative assistant generating engaging text.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 512,
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
    params.size = "1792x1024";
  }

  return provider.client.images.generate(params);
}
