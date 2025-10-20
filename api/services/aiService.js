import dotenv from "dotenv";
import * as aiPrompts from "../utils/aiPrompts.js";
import getProviders from "../utils/aiProviders.js";

dotenv.config();

const keys = {
  openai: process.env?.OPENAI_API_KEY || "OPENAI_API_KEY",
  xai: process.env?.XAI_API_KEY || "XAI_API_KEY",
};
const providers = getProviders(keys);

export async function fetchHaiku() {
  const prompt = aiPrompts.haikuPrompt;
  const result = await fetchHaikuResultFromAI(providers.grok, prompt);
  return result.choices[0].message.content;
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
