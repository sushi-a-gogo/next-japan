import { resolveRoot } from "./resolveRoot.js";

export const USERS_JSON = resolveRoot("data", "users", "default-users.json");
export const USERS_REWARDS_JSON = resolveRoot(
  "data",
  "users",
  "user-rewards.json"
);
export const EVENTS_JSON = resolveRoot("data", "events", "events.json");
export const LOCATIONS_JSON = resolveRoot(
  "data",
  "locations",
  "locations.json"
);
export const OPPORTUNITIES_JSON = resolveRoot(
  "data",
  "opportunities",
  "opportunities.json"
);
export const ORGANIZATION_JSON = resolveRoot("data", "organization.json");
export const CACHE_DIRECTORY = resolveRoot("tmp", "cache", "resized");
