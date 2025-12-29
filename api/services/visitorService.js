// services/visitorService.js
import crypto from "crypto";
import geoip from "geoip-lite"; // ← new import
import Visitor from "../models/Visitor.js";

export const trackVisit = async (visitData, req) => {
  const { path, referrer } = visitData;

  if (!path) {
    throw new Error("Path is required");
  }

  const ipRaw =
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.headers["x-real-ip"] ||
    req.socket.remoteAddress ||
    null;

  const hashedIp = ipRaw
    ? crypto.createHash("sha256").update(ipRaw).digest("hex")
    : null;

  // GeoIP lookup (only if we have a real IP)
  const geo = ipRaw ? geoip.lookup(ipRaw) : null;
  const country = geo?.country || null; // e.g., "JP", "US", "DE" (ISO 2-letter)

  const userAgent = req.headers["user-agent"] || null;

  const visit = new Visitor({
    path,
    ip: hashedIp,
    userAgent,
    referrer: referrer || null,
    country, // ← new field
  });

  await visit.save();
  return;
};
