import { jest } from "@jest/globals";
import request from "supertest";
// 🔹 Mock the Event model BEFORE importing the app
jest.mock("../models/Event.js");
// 🔹 Now import the app (NOT server.js — that would connect to Mongo)
const { default: app } = await import("../index.js");
const { default: Event } = await import("../models/Event.js");

describe("GET /api/events", () => {
  it("should return a list of events from the mocked DB", async () => {
    const mockEvents = [
      { _id: "1", eventTitle: "Magical Hokkaido" },
      { _id: "2", eventTitle: "Tokyo Skyline Evening" },
    ];

    // Set up the static find method as a mock
    Event.find = jest.fn();

    // Mock the query chain (find().sort().limit())
    Event.find.mockImplementation(() => ({
      sort: jest.fn().mockReturnThis(), // Returns the query for chaining
      limit: jest.fn().mockResolvedValue(mockEvents), // Resolves with data (assumes await or .then in route)
    }));

    // Alternative if no chaining in route: Just resolve find() directly
    // Event.find.mockResolvedValue(mockEvents);

    const res = await request(app).get("/api/events");
    console.log("Response body:", res.body); // Keep for debugging
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0].eventTitle).toBe("Magical Hokkaido");
  });
});
