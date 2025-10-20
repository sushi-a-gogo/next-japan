import { jest } from "@jest/globals";

// Mock jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn().mockImplementation(() => ({
    userId: "test-user",
    email: "test@example.com",
  })),
}));

// Mock OpenAI

// Mock OpenAI
jest.mock("openai", () => {
  const mockOpenAI = jest.fn().mockImplementation(() => {
    console.log("OpenAI mock instantiated"); // Debug
    return {
      chat: {
        completions: {
          create: jest.fn().mockImplementation((options) => {
            console.log("chat.completions.create called with:", options.model); // Debug
            return Promise.resolve({
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      eventTitle: options.model.includes("grok")
                        ? "Kyoto Festival"
                        : "Mocked Event",
                      description: options.model.includes("grok")
                        ? "A vibrant festival"
                        : "Mocked description",
                    }),
                  },
                },
              ],
            });
          }),
        },
      },
      images: {
        generate: jest.fn().mockImplementation((options) => {
          console.log("images.generate called with:", options.model || options); // Debug
          return Promise.resolve({
            data: [{ url: "https://mocked.image.url" }],
          });
        }),
      },
      moderations: {
        create: jest.fn().mockImplementation(() => {
          console.log("moderations.create called"); // Debug
          return Promise.resolve({ results: [{ flagged: false }] });
        }),
      },
    };
  });
  mockOpenAI.OpenAI = mockOpenAI; // Support named import
  return mockOpenAI;
});
