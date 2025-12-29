// services/visitorService.js
import crypto from "crypto";
import Visitor from "../models/Visitor.js";

export const trackVisit = async (visitData, req) => {
  const { path, referrer } = visitData;

  if (!path) {
    throw new Error("Path is required"); // only path is truly required
  }

  // Get real client IP from headers (Render sets this)
  const ipRaw =
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.headers["x-real-ip"] ||
    req.socket.remoteAddress ||
    null;

  const hashedIp = ipRaw
    ? crypto.createHash("sha256").update(ipRaw).digest("hex")
    : null;

  const userAgent = req.headers["user-agent"] || null;

  const visit = new Visitor({
    path,
    ip: hashedIp,
    userAgent,
    referrer: referrer || null,
  });

  await visit.save();
  return; // nothing to return
};
