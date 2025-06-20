import { resolveRoot } from "./resolveRoot.js";

export const EVENTS_JSON = resolveRoot("data", "events", "events.json");
export const EVENTS_FULL_JSON = resolveRoot(
  "data",
  "events",
  "full-events.json"
);
export const USERS_JSON = resolveRoot("data", "users", "default-users.json");
export const OPPORTUNITIES_JSON = [
  resolveRoot("data", "opportunities", "event-1-opportunities.json"),
  resolveRoot("data", "opportunities", "event-2-opportunities.json"),
  resolveRoot("data", "opportunities", "event-3-opportunities.json"),
];
export const ORGANIZATION_JSON = resolveRoot("data", "organization.json");
export const CACHE_DIRECTORY = resolveRoot("tmp", "cache", "resized");
