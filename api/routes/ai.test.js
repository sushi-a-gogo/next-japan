import { jest } from "@jest/globals";
import request from "supertest";

let app;
beforeAll(async () => {
  const appModule = await import("../index.js");
  app = appModule.default;
});

describe("POST /api/ai/generate-content", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // it("should generate AI event (Grok provider)", async () => {
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
  //   expect(res.body.success).toBe(true);
  //   expect(res.body.data.eventTitle).toBe("Kyoto Festival");
  //   expect(res.body.data.imageUrl).toBe("https://mocked.image.url");
  //   expect(res.body.data.aiProvider).toBe("Grok");
  // });

  it("should handle invalid input", async () => {
    const res = await request(app)
      .post("/api/ai/generate-content")
      .send({})
      .set("Cookie", "accessToken=fake-token");
    expect(res.status).not.toBe(200);
    //expect(res.status).toBe(400);
    //expect(res.body.error).toContain("Missing promptParams");
  });
});
