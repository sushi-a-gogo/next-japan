import { jest } from "@jest/globals";
import request from "supertest";

// Mock Event model
jest.mock("../models/Event.js");

// Import app and Event after mocks
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
    const res = await request(app).get("/api/events");
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0].eventTitle).toBe("Magical Hokkaido");
  });
});
