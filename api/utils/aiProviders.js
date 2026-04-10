import OpenAI from "openai";

const getProviders = (keys) => {
  const providers = {
    openai: {
      name: "OpenAI",
      client: new OpenAI({ apiKey: keys.openai }),
      model: "gpt-5.4-mini",
      imageModel: "gpt-image-1.5",
    },
    grok: {
      name: "Grok",
      client: new OpenAI({
        apiKey: keys.xai,
        baseURL: "https://api.x.ai/v1",
      }),
      model: "grok-4.20-multi-agent",
      imageModel: "grok-imagine-image",
    },
  };
  return providers;
};

export default getProviders;
