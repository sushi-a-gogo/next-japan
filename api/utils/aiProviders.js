import OpenAI from "openai";

const getProviders = (keys) => {
  const providers = {
    openai: {
      name: "OpenAI",
      client: new OpenAI({ apiKey: keys.openai }),
      model: "gpt-4o-mini",
      imageModel: "dall-e-3",
    },
    grok: {
      name: "Grok",
      client: new OpenAI({
        apiKey: keys.xai,
        baseURL: "https://api.x.ai/v1",
      }),
      model: "grok-3",
      imageModel: "grok-2-image-latest",
    },
  };
  return providers;
};

export default getProviders;
