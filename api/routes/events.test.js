import { jest } from "@jest/globals";
import request from "supertest";

// Mock OpenAI
jest.mock("openai", () => {
  const mockOpenAI = {
    OpenAI: jest.fn().mockImplementation(() => {
      console.log("OpenAI mock instantiated"); // Debug
      return {
        chat: {
          completions: {
            create: jest.fn().mockImplementation((options) => {
              console.log(
                "chat.completions.create called with:",
                options.model
              ); // Debug
              if (options.model.includes("grok")) {
                return Promise.resolve({
                  choices: [
                    {
                      message: {
                        content: JSON.stringify({
                          eventTitle: "Kyoto Festival",
                          description: "A vibrant festival",
                        }),
                      },
                    },
                  ],
                });
              }
              return Promise.resolve({
                choices: [
                  {
                    message: {
                      content: JSON.stringify({
                        eventTitle: "Mocked Event",
                        description: "Mocked description",
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
            console.log("images.generate called with:", options.model); // Debug
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
    }),
  };
  return mockOpenAI;
});

// Mock jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn().mockImplementation(() => ({
    userId: "test-user",
    email: "test@example.com",
  })),
}));

// Mock Event model
jest.mock("../models/Event.js");

// Clear module cache before each test
beforeEach(() => {
  jest.resetModules(); // Reset module cache
  jest.clearAllMocks();
});

// Import app and Event dynamically
let app, Event;
beforeAll(async () => {
  const appModule = await import("../index.js");
  const eventModule = await import("../models/Event.js");
  app = appModule.default;
  Event = eventModule.default;
});

describe("GET /api/events", () => {
  it("should return a list of events from the mocked DB", async () => {
    const mockEvents = [
      { _id: "1", eventTitle: "Magical Hokkaido" },
      { _id: "2", eventTitle: "Tokyo Skyline Evening" },
    ];

    Event.find = jest.fn().mockImplementation(() => ({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockEvents),
    }));

    const res = await request(app)
      .get("/api/events")
      .set("Cookie", "accessToken=fake-token");
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0].eventTitle).toBe("Magical Hokkaido");
  });
});

describe("POST /api/ai/generate-content", () => {
  // it("should generate and save AI event", async () => {
  //   const mockEvent = {
  //     _id: "3",
  //     eventTitle: "Kyoto Festival",
  //     description: "A vibrant festival",
  //     image: { id: "event-image-123.png", width: 1792, height: 1024 },
  //     imageUrl: "https://mocked.image.url",
  //     aiProvider: "Grok",
  //   };
  //   Event.create = jest.fn().mockResolvedValue(mockEvent);
  //   const promptParams = {
  //     destination: "Kyoto",
  //     tone: "Serene",
  //     mood: "Excited",
  //     season: "Fall",
  //     activity: "Festival",
  //     groupSize: "2",
  //     timeOfDay: "Morning",
  //     aiProvider: "Grok",
  //     customText: "Make it so!",
  //   };
  //   const res = await request(app)
  //     .post("/api/ai/generate-content")
  //     .send({ promptParams })
  //     .set("Cookie", "accessToken=fake-token");
  //   expect(res.status).toBe(200);
  //   expect(res.body.data.eventTitle).toBe("Kyoto Festival");
  //   expect(res.body.data.imageUrl).toBe("https://mocked.image.url");
  //   expect(res.body.data.aiProvider).toBe("Grok");
  // }, 10000); // Temporary timeout
  // it("should handle invalid input", async () => {
  //   const res = await request(app)
  //     .post("/api/ai/generate-content")
  //     .send({})
  //     .set("Cookie", "accessToken=fake-token");
  //   expect(res.status).toBe(400);
  //   expect(res.body.error).toContain("Missing promptParams");
  // });
});
